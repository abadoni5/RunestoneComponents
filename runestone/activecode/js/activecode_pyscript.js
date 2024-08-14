import { ActiveCode } from "./activecode.js";

export default class PyScriptActiveCode extends ActiveCode {
    constructor(opts) {
        super(opts);
        opts.alignVertical = true;
        this.python3_interpreter = $(orig).data("python3_interpreter");
        $(this.runButton).text("Render");
        this.editor.setValue(this.code);
    }

    async runProg() {
        var prog = await this.buildProg(true);
        let saveCode = "True";
        this.saveCode = await this.manage_scrubber(saveCode);
        $(this.output).text("");
        if (!this.alignVertical) {
            $(this.codeDiv).switchClass("col-md-12", "col-md-6", {
                duration: 500,
                queue: false,
            });
        }
        $(this.outDiv).show({ duration: 700, queue: false });
        prog = `
        <html>
        <head>
            <link rel="stylesheet" href="https://pyscript.net/latest/pyscript.css" />
            <script defer src="https://pyscript.net/latest/pyscript.js"></script>
            <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.0.1/styles/default.min.css">
            <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.0.1/highlight.min.js"></script>
            <style>
                pre {
                    position: absolute; font-size: 13px; width: 94%; padding: 9.5px; line-height: 1.42857143; border: 1px ; border-radius: 4px;
                }
                code{
                    border: 1px solid #ccc; border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <py-config>
                terminal = false
                packages = [ "pandas", "numpy", "matplotlib", "sympy"]
            </py-config>
            <pre id="consolePre">
                <code id="consoleCode"></code>
            </pre>
            <py-script>
import sys
from js import document
logger = document.getElementById('consoleCode')
preElem = document.getElementById('consolePre')

class NewOut:
    def write(self, data):
        logger.innerHTML += str(data)
sys.stderr = sys.stdout = NewOut()

def my_exec(code):
    try:
        exec(code)
        preElem.style.visibility = "visible"
        preElem.style.bottom = "5px"
        logger.classList.add("plaintext")
    except Exception as err:
        error_class = err.__class__.__name__
        detail = err.args[0]
        line_number = ""  # PyScript does not currently expose line numbers
        result = f"'{error_class}': {detail} {line_number}"
        print(result)
        # Styling the pre element for error
        preElem.style.visibility = "visible"
        preElem.style.top = "5px"
        preElem.style.backgroundColor = "#f2dede"
        preElem.style.border = "1px solid #ebccd1"
        logger.classList.add("python")

# usage
my_exec("""${prog}
""")
            </py-script>
            <script>
                hljs.highlightAll();
            </script>
        </body>
        </html>
        `;
        this.output.srcdoc = prog;
    }

    createOutput() {
        this.alignVertical = true;
        var outDiv = document.createElement("div");
        $(outDiv).addClass("ac_output");
        if (this.alignVertical) {
            $(outDiv).addClass("col-md-12");
        } else {
            $(outDiv).addClass("col-md-5");
        }
        this.outDiv = outDiv;
        this.output = document.createElement("iframe");
        $(this.output).css("background-color", "white");
        $(this.output).css("position", "relative");
        $(this.output).css("height", "400px");
        $(this.output).css("width", "100%");
        outDiv.appendChild(this.output);
        this.outerDiv.appendChild(outDiv);
        var clearDiv = document.createElement("div");
        $(clearDiv).css("clear", "both"); // needed to make parent div resize properly
        this.outerDiv.appendChild(clearDiv);
    }
    enableSaveLoad() {
        $(this.runButton).text($.i18n("msg_activecode_render"));
    }
}