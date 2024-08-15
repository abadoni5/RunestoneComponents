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
                .output-div {
                    width: 100%;
                    min-height: 100px;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    padding: 5px;
                }
            </style>
        </head>
        <body>
            <py-config>
                terminal = false
                packages = ["pandas", "numpy", "matplotlib", "sympy"]
            </py-config>
            <div id="output-container"></div>
            <py-script>
import sys
from js import document
import matplotlib.pyplot as plt
import io
import base64

class NewOut:
    def write(self, data):
        display(data, "console")
sys.stderr = sys.stdout = NewOut()

def display(obj, target="console"):
    container = document.getElementById('output-container')
    target_div = document.getElementById(target)
    if not target_div:
        target_div = document.createElement('div')
        target_div.id = target
        target_div.className = 'output-div'
        container.appendChild(target_div)
    
    if isinstance(obj, plt.Figure):
        buf = io.BytesIO()
        obj.savefig(buf, format='png')
        buf.seek(0)
        img_str = base64.b64encode(buf.getvalue()).decode('utf-8')
        target_div.innerHTML += f'<img src="data:image/png;base64,{img_str}" />'
        plt.close(obj)
    else:
        target_div.innerHTML += str(obj) + '<br>'

def my_exec(code):
    try:
        exec(code)
    except Exception as err:
        error_class = err.__class__.__name__
        detail = err.args[0]
        result = f"'{error_class}': {detail}"
        display(result, "console")

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
        $(this.output).css({
            "background-color": "white",
            "position": "relative",
            "height": "600px",
            "width": "100%"
        });
        outDiv.appendChild(this.output);

        this.outerDiv.appendChild(outDiv);
        var clearDiv = document.createElement("div");
        $(clearDiv).css("clear", "both");
        this.outerDiv.appendChild(clearDiv);
    }

    enableSaveLoad() {
        $(this.runButton).text($.i18n("msg_activecode_render"));
    }
}