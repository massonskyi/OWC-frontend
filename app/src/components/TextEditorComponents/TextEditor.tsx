import React, { useState } from "react";
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
import { Box, Typography, Divider } from "@mui/material";
import { Tooltip, showTooltip, hoverTooltip, showPanel, Panel, keymap } from "@codemirror/view";
import { StateField, StateEffect, EditorState, Text } from "@codemirror/state";

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

// Функция для подсчета слов
function countWords(doc: Text) {
  let count = 0, iter = doc.iter();
  while (!iter.next().done) {
    let inWord = false;
    for (let i = 0; i < iter.value.length; i++) {
      let word = /\w/.test(iter.value[i]);
      if (word && !inWord) count++;
      inWord = word;
    }
  }
  return `Word count: ${count}`;
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

export const TextEditor: React.FC = () => {
  const [language, setLanguage] = useState<string>("python");
  const [code, setCode] = useState<string>("print('Hello, world!')");
  const [output, setOutput] = useState<string[]>([]);
  const [theme, setTheme] = useState(themeList[0].theme);

  const handlerOutput = (result: string) => {
    setOutput(prev => [...prev, result]);
  };

  const handlerCodeChange: ICodeChangeHandler = (editor) => {
    setCode(editor);
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = themeList.find(theme => theme.name === event.target.value);
    if (selectedTheme) {
      setTheme(selectedTheme.theme);
    }
  };

  const updateCodeMirrorMode = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setCode(getDefaultCode(selectedLanguage));
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

  return (
    <Box display="flex" flexDirection="column" sx={{ backgroundColor: "#1e1e1e", height: "100vh", width: "100vw" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ padding: 2, backgroundColor: "#2a2a2a" }}>
        <Box display="flex" gap={2}>
          <ExecBtn code={code} language={language} onOutput={handlerOutput} />
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
          Your files here
        </Typography>
      </Box>

      <Box display="flex" flex={1} sx={{ height: "100%" }}>
        <Box flex={8} padding={2}>
        <CodeMirror
              value={code}
              theme={theme}
              extensions={[
                getMode(language),
                EditorView.lineWrapping,
                cursorTooltipField,
                wordHover,
                regexpLinter,
                helpPanel(),
                wordCounter(),
              ]}
              onChange={handlerCodeChange}
              style={{ width: "100%", maxHeight: "80vh", overflow: "auto", minHeight: "80vh" }}
            />
          <Console output={output} />
        </Box>

        <Divider orientation="vertical" flexItem sx={{ backgroundColor: "#000" }} />

        <Box flex={2} padding={2} sx={{ backgroundColor: "#282828" }}>
          <FileListComponent onCodeLoaded={handlerCodeChange} />
        </Box>
      </Box>
    </Box>
  );
};
