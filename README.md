# Markdown Studio

A free, privacy-first Markdown editor with an instant preview. Write, format, copy, and download Markdown directly in your browser.

## Features

- Live preview while typing
- Headings, paragraphs, lists, blockquotes, and horizontal rules
- Bold, italic, inline code, and fenced code blocks
- Safe HTTP/HTTPS links
- Word count, copy, and `.md` download
- Dark and light themes
- Responsive interface and reduced-motion support

## Privacy

Your document is processed locally in your browser. There is no account, backend, API key, or document upload.

## Run locally

Download or clone this repository, then open `index.html` in a modern browser. You can also use a local static server:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Supported Markdown

This project implements a lightweight Markdown subset. It does not currently support every CommonMark feature. See [docs/FEATURES.md](docs/FEATURES.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Please report security issues privately as described in [SECURITY.md](SECURITY.md).

## License

MIT. See [LICENSE](LICENSE).

This project is independent and is not affiliated with or endorsed by any Markdown vendor or platform.
