package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/BurntSushi/toml"
	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/html"
	"github.com/jakebowkett/go-hyphenate/hyphenate"
)

/*
TODO: check that tree node ids and output file names match
and that none are missing or referenced without existing.
*/

var (
	hyphen hyphenate.Hyphenator
)

func main() {
	args := os.Args[1:] // First arg is program name.
	req := 3
	if len(args) < req {
		log.Fatalf("got %d args, require %d (src, dst, prefix)", len(args), req)
	}
	src := args[0]
	dst := args[1]
	prefix := args[2]
	tsxFile := args[3]
	mode := args[4]
	seen, err := toml2html(src, dst)
	if err != nil {
		log.Fatal(err)
	}
	if err := webpackImports(src, prefix, tsxFile, mode, seen); err != nil {
		log.Fatal(err)
	}
}

type content struct {
	Name string
	To   string
	Meta string
	From string
	Body string
}

func (c content) Bytes() []byte {
	return []byte(c.To + c.Meta + c.Body + c.From)
}

func toml2html(src, dst string) (map[string]string, error) {

	hyphen = hyphenator()
	seen := make(map[string]string)

	dd, err := os.ReadDir(src)
	if err != nil {
		return nil, err
	}

	for _, d := range dd {

		if d.IsDir() {
			continue
		}

		// Ignore non-markdown files.
		if !strings.HasSuffix(d.Name(), ".md") {
			continue
		}

		path := filepath.Join(src, d.Name())
		bb, err := os.ReadFile(path)
		if err != nil {
			return nil, err
		}

		// Unmarshal TOML.
		c := content{}
		if err := toml.Unmarshal(bb, &c); err != nil {
			return nil, err
		}

		if _, ok := seen[c.Name]; ok {
			return nil, fmt.Errorf("duplicate output file names")
		}
		seen[c.Name] = d.Name()

		// Render HTML.
		r := html.NewRenderer(html.RendererOptions{RenderNodeHook: hText})
		c.To = wrap(mdToHTML(c.To, r), "to")
		c.Meta = wrap(mdToHTML(c.Meta, r), "meta")
		c.From = wrap(mdToHTML(c.From, r), "from")
		c.Body = mdToHTML(c.Body, r)

		// Save to public sub-directory.
		name := filepath.Join(dst, c.Name+".html")
		if err := os.MkdirAll(dst, 0600); err != nil {
			return nil, err
		}
		if err := writeIfUnique(name, c.Bytes()); err != nil {
			return nil, err
		}
		// if err := os.WriteFile(name, c.Bytes(), 0600); err != nil {
		// 	return nil, err
		// }
	}

	return seen, nil
}

func mdToHTML(md string, r *html.Renderer) string {
	if md == "" {
		return ""
	}
	md = contiguousNewlines.ReplaceAllString(md, "\n\n")
	return string(markdown.ToHTML([]byte(md), nil, r))
}

func wrap(html, class string) string {
	if html == "" {
		return ""
	}
	return fmt.Sprintf(
		`<div class="%s"><div class="inner">%s</div></div>`,
		class,
		html,
	)
}
