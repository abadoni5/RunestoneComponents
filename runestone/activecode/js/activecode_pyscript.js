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
                #output-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                }
                #console-output {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    margin-bottom: 10px;
                }
                #plot-output {
                    flex: 2;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                pre {
                    margin: 0;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
            </style>
        </head>
        <body>
            <py-config>
                terminal = false
                packages = ["pandas", "numpy", "matplotlib", "sympy"]
            </py-config>
            <div id="output-container">
                <div id="console-output">
                    <pre><code id="consoleCode"></code></pre>
                </div>
                <div id="plot-output"></div>
            </div>
            <py-script>
import sys
from js import document
import matplotlib.pyplot as plt
from sympy import Symbol, sin, cos, pi
from sympy.plotting import plot

logger = document.getElementById('consoleCode')
plot_div = document.getElementById('plot-output')

class NewOut:
    def write(self, data):
        logger.innerHTML += str(data)

sys.stderr = sys.stdout = NewOut()

def display(fig):
    plot_div.innerHTML = ''  # Clear previous plot
    if hasattr(fig, 'canvas'):  # Matplotlib figure
        fig.canvas.render()
        plot_div.appendChild(fig.canvas)
    elif hasattr(fig, '_backend'):  # SymPy plot
        fig._backend.fig.canvas.render()
        plot_div.appendChild(fig._backend.fig.canvas)
    else:
        print("Unsupported plot type")

def my_exec(code):
    try:
        exec(code)
    except Exception as err:
        error_class = err.__class__.__name__
        detail = err.args[0]
        result = f"'{error_class}': {detail}"
        print(result)
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