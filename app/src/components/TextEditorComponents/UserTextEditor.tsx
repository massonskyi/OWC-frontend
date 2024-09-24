import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import {
  andromeda,
  androidstudio,
  atomone,
  basicLight,
  basicDark,
  copilot,
  dracula,
  githubDark,
  githubLight,
  materialDark,
  kimbie
} from "@uiw/codemirror-themes-all";
import { linter, Diagnostic } from "@codemirror/lint";
import { syntaxTree } from "@codemirror/language";
import { ICodeChangeHandler } from "../../interfaces/ITextEditor/ICodeChangeHandler";
import LanguageSelection from "./LanguageSelector";
import ExecBtn from "./ExecButton";
import FileListComponent from "../FileManagerComponents/FileListComponents";
import Console from "../Console";
import { Box, Typography, Divider, Tabs, Tab, IconButton } from "@mui/material";
import { Tooltip, showTooltip, hoverTooltip, showPanel, Panel, keymap } from "@codemirror/view";
import { StateField, StateEffect, EditorState, Text } from "@codemirror/state";
import CloseIcon from '@mui/icons-material/Close';

const regexpLinter = linter((view: EditorView) => {
  let diagnostics: Diagnostic[] = [];
  syntaxTree(view.state).cursor().iterate(node => {
    if (node.name === "RegExp") {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: "warning",
        message: "Regular expressions are FORBIDDEN",
        actions: [{
          name: "Remove",
          apply(view, from, to) { view.dispatch({ changes: { from, to } }) }
        }]
      });
    }
  });
  return diagnostics;
});

// Функция для создания панели помощи
function createHelpPanel(view: EditorView) {
  let dom = document.createElement("div");
  dom.textContent = "F1: Toggle the help panel";
  dom.className = "cm-help-panel";
  return { top: true, dom };
}

// Эффект для переключения панели помощи
const toggleHelp = StateEffect.define<boolean>();

// Состояние панели помощи
const helpPanelState = StateField.define<boolean>({
  create: () => false,
  update(value, tr) {
    for (let e of tr.effects) if (e.is(toggleHelp)) value = e.value;
    return value;
  },
  provide: f => showPanel.from(f, on => on ? createHelpPanel : null)
});

// Клавиша для переключения панели помощи
const helpKeymap = [{
  key: "F1",
  run(view: EditorView) {
    view.dispatch({
      effects: toggleHelp.of(!view.state.field(helpPanelState))
    });
    return true;
  }
}];

// Тема для панели помощи
const helpTheme = EditorView.baseTheme({
  ".cm-help-panel": {
    padding: "5px 10px",
    backgroundColor: "#EFC0E6FF",
    fontFamily: "monospace"
  }
});

// Функция для включения панели помощи
export function helpPanel() {
  return [helpPanelState, keymap.of(helpKeymap), helpTheme];
}

function countWords(doc: Text) {
  const text = doc.toString();
  const words = text.match(/\b\w+\b/g);
  return `Word count: ${words ? words.length : 0}`;
}

// Функция для создания панели подсчета слов
function wordCountPanel(view: EditorView): Panel {
  let dom = document.createElement("div");
  dom.textContent = countWords(view.state.doc);
  return {
    dom,
    update(update) {
      if (update.docChanged)
        dom.textContent = countWords(update.state.doc);
    }
  };
}

// Функция для включения панели подсчета слов
export function wordCounter() {
  return showPanel.of(wordCountPanel);
}

// Функция для отображения подсказок при наведении
export const wordHover = hoverTooltip((view: EditorView, pos, side) => {
  let { from, to, text } = view.state.doc.lineAt(pos);
  let start = pos, end = pos;
  while (start > from && /\w/.test(text[start - from - 1])) start--;
  while (end < to && /\w/.test(text[end - from])) end++;
  if (start === pos && side < 0 || end === pos && side > 0) return null;
  return {
    pos: start,
    end,
    above: true,
    create(view: EditorView) {
      let dom = document.createElement("div");
      dom.textContent = text.slice(start - from, end - from);
      return { dom };
    }
  };
});

const themeList = [
  { name: "andromeda", theme: andromeda },
  { name: "androidstudio", theme: androidstudio },
  { name: "atomone", theme: atomone },
  { name: "basicLight", theme: basicLight },
  { name: "basicDark", theme: basicDark },
  { name: "copilot", theme: copilot },
  { name: "dracula", theme: dracula },
  { name: "githubDark", theme: githubDark },
  { name: "githubLight", theme: githubLight },
  { name: "materialDark", theme: materialDark },
  { name: "kimbie", theme: kimbie }
];

interface TabData {
  filename: string;
  code: string;
  language: string;
}

export const UserTextEditor: React.FC = () => {
  const { workspaceName } = useParams<{ workspaceName: string }>();
  const [tabs, setTabs] = useState<TabData[]>([
    { filename: "default", code: "print('Hello, world!')", language: "python" }
  ]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [output, setOutput] = useState<string[]>([]);
  const [theme, setTheme] = useState(themeList[0].theme);

  const handlerOutput = (result: string) => {
    setOutput(prev => [...prev, result]);
  };

  const handlerCodeChange: ICodeChangeHandler = (editor) => {
    setTabs(prevTabs => {
      const newTabs = [...prevTabs];
      newTabs[activeTab].code = editor;
      return newTabs;
    });
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = themeList.find(theme => theme.name === event.target.value);
    if (selectedTheme) {
      setTheme(selectedTheme.theme);
    }
  };

  const cursorTooltipField = StateField.define<readonly Tooltip[]>({
    create: getCursorTooltips,
    update(tooltips, tr) {
      if (!tr.docChanged && !tr.selection) return tooltips;
      return getCursorTooltips(tr.state);
    },
    provide: f => showTooltip.computeN([f], state => state.field(f))
  });

  function getCursorTooltips(state: EditorState): readonly Tooltip[] {
    return state.selection.ranges
      .filter(range => range.empty)
      .map(range => {
        let line = state.doc.lineAt(range.head);
        let text = line.number + ":" + (range.head - line.from);
        return {
          pos: range.head,
          above: true,
          strictSide: true,
          arrow: true,
          create: () => {
            let dom = document.createElement("div");
            dom.className = "cm-tooltip-cursor";
            dom.textContent = text;
            return { dom };
          }
        };
      });
  }

  const getDefaultCode = (selectedLanguage: string): string => {
    switch (selectedLanguage) {
      case "python":
        return "print('Hello, world!')";
      case "c":
        return '#include <stdio.h>\n\nint main() {\n   printf("Hello world");\n   return 0;\n}';
      case "cpp":
        return '#include <iostream>\n\nint main() {\n   std::cout << "hello, world!" << std::endl;\n   return 0;\n}';
      case "cs":
        return 'Console.WriteLine("Hello, world!");';
      case "js":
        return "console.log('Hello, world!');";
      case "ruby":
        return "puts 'hello, world!'";
      case "go":
        return "package main\n\nimport \"fmt\"\n\nfunc main() {\n   fmt.Println(\"Hello, world!\")\n}";
      case "html":
        return "<!DOCTYPE html>\n<html>\n<head>\n<title>Hello World</title>\n</head>\n<body>\n<h1>Hello, World!</h1>\n</body>\n</html>";
      default:
        return "print('Hello, world!')";
    }
  };

  const getMode = (selectedLanguage: string) => {
    const modes: Record<string, () => any> = {
      python: langs.python,
      c: langs.c,
      cpp: langs.cpp,
      cs: langs.csharp,
      js: () => langs.javascript({ jsx: true }),
      ruby: langs.ruby,
      go: langs.go,
      html: langs.html
    };

    const mode = modes[selectedLanguage] || langs.python;
    console.log(`Selected language: ${selectedLanguage}, Mode:`, mode);

    return mode();
  };


  const updateCodeMirrorMode = (selectedLanguage: string) => {
    setTabs(prevTabs => {
      const newTabs = [...prevTabs];
      newTabs[activeTab].language = selectedLanguage;
      if (newTabs[activeTab].filename === "default") {
        newTabs[activeTab].code = getDefaultCode(selectedLanguage);
      }
      return newTabs;
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTabClose = (index: number) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter((_, i) => i !== index);
      // Обновляем активную вкладку
      if (activeTab >= index && activeTab > 0) {
        setActiveTab(activeTab - 1);
      }
      return newTabs;
    });
  };

  const handleCodeLoaded = (filename: string, code: string) => {
    setTabs(prevTabs => {
      const existingTab = prevTabs.find(tab => tab.filename === filename);
      if (existingTab) {
        setActiveTab(prevTabs.indexOf(existingTab));
        return prevTabs;
      } else {
        const newTabs = [...prevTabs, { filename, code, language: "python" }];
        setActiveTab(newTabs.length - 1); // Переключение на новую вкладку
        return newTabs;
      }
    });
  };

  return (
    <Box display="flex" flexDirection="column" sx={{ backgroundColor: "#1e1e1e", height: "100vh", width: "100vw" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ padding: 2, backgroundColor: "#2a2a2a" }}>
        <Box display="flex" gap={2}>
          <ExecBtn code={tabs[activeTab]?.code || ""} language={tabs[activeTab]?.language || "python"} onOutput={handlerOutput} />
          <LanguageSelection onSelectionChange={updateCodeMirrorMode} />
          <select onChange={handleThemeChange}>
            {themeList.map((theme) => (
              <option key={theme.name} value={theme.name}>
                {theme.name}
              </option>
            ))}
          </select>
        </Box>
        <Typography variant="h6" sx={{ color: "#fff", marginLeft: 2 }}>
          {workspaceName}
        </Typography>
      </Box>

      <Box display="flex" flex={1} sx={{ height: "100%" }}>
        <Box flex={8} padding={2}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="editor tabs">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box display="flex" alignItems="center">
                    {tab.filename}
                    {tab.filename !== "default" && (
                      <IconButton size="small" onClick={() => handleTabClose(index)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
          {tabs.length > 0 && (
            <CodeMirror
              value={tabs[activeTab]?.code || ""}
              theme={theme}
              extensions={[
                getMode(tabs[activeTab]?.language || "python"),
                EditorView.lineWrapping,
                cursorTooltipField,
                wordHover,
                regexpLinter,
                helpPanel(),
                wordCounter(),
              ]}
              onChange={handlerCodeChange}
              style={{ width: "100%", maxHeight: "60vh", overflow: "auto", minHeight: "50vh" }}
            />
          )}
          <Console output={output} />
        </Box>

        <Divider orientation="vertical" flexItem sx={{ backgroundColor: "#000" }} />

        <Box flex={2} padding={2} sx={{ backgroundColor: "#282828" }}>
          <FileListComponent onCodeLoaded={(code) => handleCodeLoaded("filename", code)} workspaceName={workspaceName || ""} />
        </Box>
      </Box>
    </Box>
  );
};