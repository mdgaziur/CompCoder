const initEJ = (s, i, hs) => {
    const editor = new EditorJS({
    tools: {
            header: {
                class: Header,
                inlineToolbar: ['link'],
                config: {
                    placeholder: 'Header'
                },
                shortcut: 'CMD+SHIFT+H'
            },
            image: {
                class: ImageTool,
                config: {
                    endpoints: {
                        byFile: '/ImageUpload', // Your backend file uploader endpoint
                        byUrl: '/ImageUpload', // Your endpoint that provides uploading by Url
                    }
                }
            },
            list: {
                class: List,
                inlineToolbar: true,
                shortcut: 'CMD+SHIFT+L'
            },
            quote: {
                class: Quote,
                inlineToolbar: true,
                config: {
                    quotePlaceholder: 'Enter a quote',
                    captionPlaceholder: 'Quote\'s author',
                },
                shortcut: 'CMD+SHIFT+O'
            },
            warning: Warning,
            marker: {
                class: Marker,
                shortcut: 'CMD+SHIFT+M'
            },
            code: {
                class: CodeTool,
                shortcut: 'CMD+SHIFT+C'
            },
            embed: Embed,
            table: {
                class: Table,
                inlineToolbar: true,
                shortcut: 'CMD+ALT+T'
            },
            Math: {
                class: EJLaTeX,
                shortcut: 'CMD+SHIFT+M'
            }
        },
        data: {"time":1599860426267,"blocks":[{"type":"header","data":{"text":"Description","level":2}},{"type":"paragraph","data":{"text":"Insert problem description here."}},{"type":"header","data":{"text":"Input<br>","level":2}},{"type":"paragraph","data":{"text":"Insert problem input explanation here."}},{"type":"header","data":{"text":"Output<br>","level":2}},{"type":"paragraph","data":{"text":"Insert problem output explanation here."}},{"type":"header","data":{"text":"Constrains","level":2}},{"type":"paragraph","data":{"text":"Insert problem constrains explanation here."}},{"type":"paragraph","data":{"text":"<b>Read the following text carefully and remove that when you finished writing the problem description.<br></b>"}},{"type":"paragraph","data":{"text":"Note: If you want to add mathematical expressions, you can just add that by pressing Ctrl+Shift+M and typing latex expression there. But it can't be added inside paragraph. It will be an individual block like below:"}},{"type":"Math","data":{"math":"\\frac{a \\pm b}{(a+b)^2}"}},{"type":"paragraph","data":{"text":"To add mathematical expressions inside paragraph, wrap your latex expression with $. Example: $\\frac{a \\pm b}{(a+b)^2}$. MathJax will take care of that."}}],"version":"2.18.0"}
    });
    s.addEventListener('click', () => {
        editor.save().then((outputData) => {
                i.value = JSON.stringify(outputData);
                hs.click();
        });
    });
};