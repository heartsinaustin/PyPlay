/* global ace, brython */
document.addEventListener("DOMContentLoaded", () => {
    ace.require("ace/ext/language_tools");
    const editor = ace.edit("editor");
    editor.session.setMode("ace/mode/python");

    editor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
    });

    if (window.location.search) {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has("code")) {
            editor.setValue(searchParams.get("code"));
        }
    }

    const editorNode = document.querySelector("#editor");
    const outputNode = document.querySelector("#console");
    const runNode = document.querySelector("#run");
    const pythonNode = document.querySelector("#python");
    const downloadNode = document.querySelector("#download");
    const filenameNode = document.querySelector("#filename");
    const clipboardNode = document.querySelector("#clipboard");
    const clearNode = document.querySelector("#clear");
    const loadingNode = document.querySelector("#loading");

    const generateNode = document.querySelector("#generate");

    editorNode.style.width = `${window.innerWidth / 1.05}px`;
    editorNode.style.height = `${window.innerHeight / 1.5}px`;

    outputNode.style.width = `${window.innerWidth / 1.05}px`;
    outputNode.style.height = `${window.innerHeight / 4}px`;

    runNode.style.width = `${window.innerWidth / 4}px`;
    downloadNode.style.width = `${window.innerWidth / 4}px`;

    const run = () => {
        pythonNode.innerHTML = `<script type="text/python">${editor.getValue()}</script>`;
        outputNode.innerHTML = "";
        brython(10);
        window.console.log = (message) => {
            outputNode.innerHTML += `${message}<br>`;
        };
    };

    const download = () => {
        const element = document.createElement("a");
        element.setAttribute(
            "href",
            `data:text/python;charset=utf-8,${encodeURIComponent(
                editor.getValue()
            )}`
        );
        element.setAttribute("download", filenameNode.value);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    editor.commands.addCommands([
        {
            name: "run",
            bindKey: {
                win: "Ctrl-Enter",
                mac: "Command-Enter",
            },
            exec: run,
        },
        {
            name: "download",
            bindKey: {
                win: "Ctrl-S",
                mac: "Command-S",
            },
            exec: download,
        },
    ]);

    runNode.addEventListener("click", () => {
        run();
    });

    downloadNode.addEventListener("click", () => {
        download();
    });

    clipboardNode.addEventListener("click", () => {
        editor.selectAll();
        editor.focus();
        document.execCommand("copy");
    });

    clearNode.addEventListener("click", () => {
        editor.setValue("");
    });

    loadingNode.addEventListener("click", () => {
        var input = document.createElement("input");
        input.type = "file";

        input.onchange = (e) => {
            var file = e.target.files[0];
            if (!file) return;
            var modelist = ace.require("ace/ext/modelist");
            var modeName = modelist.getModeForPath(file.name).mode;
            editor.session.setMode(modeName);
            reader = new FileReader();
            reader.onload = function () {
                editor.session.setValue(reader.result);
            };
            reader.readAsText(file);
        };
        input.click();
    });

    generateNode.addEventListener("click", () => {
        const link = `${window.location.origin}${
            window.location.pathname
        }?code=${encodeURIComponent(editor.getValue())}`;
        const promptNode = window.prompt("Press Ctrl/Cmd + C to copy.", link);
        console.log(promptNode);
        promptNode.select();
    });

    editor.focus();
});
