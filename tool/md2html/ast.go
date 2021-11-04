package main

import (
	"fmt"
	"io"
	"regexp"
	"strings"

	"github.com/gomarkdown/markdown/ast"
	"github.com/jakebowkett/go-hyphenate/hyphenate"
)

var (
	contiguousNewlines = regexp.MustCompile(`\n+`)
	nonAlphaNum        = regexp.MustCompile(`^\d|[^a-zA-Z0-9-]`)
	contiguousSpaces   = regexp.MustCompile(` +`)
)

func textFromChildren(n *ast.Container) string {
	txt := ""
	for _, c := range n.Children {
		t, ok := c.(*ast.Text)
		if !ok {
			continue
		}
		txt += string(t.Literal)
	}
	return txt
}

func hText(w io.Writer, node ast.Node, entering bool) (ast.WalkStatus, bool) {
	switch n := node.(type) {

	case *ast.Code:
		if !entering {
			return ast.GoToNext, true
		}
		txt := string(n.Literal)
		nbsp := "\u00A0"
		ss := strings.Split(txt, " ")
		for i, s := range ss {
			ss[i] = strings.Repeat(nbsp, len([]rune(s)))
		}
		s := fmt.Sprintf(`<code>%s</code>`, strings.Join(ss, " "))
		if _, err := io.WriteString(w, s); err != nil {
			return ast.Terminate, false
		}
		return ast.SkipChildren, true

	case *ast.Link:
		if !entering {
			return ast.GoToNext, true
		}
		txt := textFromChildren(n.AsContainer())
		s := fmt.Sprintf(`<a href="%s" target="_blank">%s</a>`, n.Destination, txt)
		if _, err := io.WriteString(w, s); err != nil {
			return ast.Terminate, false
		}
		return ast.SkipChildren, true

	case *ast.Heading:
		if n.Level != 3 {
			return ast.GoToNext, false
		}
		if !entering {
			return ast.GoToNext, true
		}
		txt := textFromChildren(n.AsContainer())
		id := strings.ToLower(strings.TrimSpace(txt))
		id = strings.Join(contiguousSpaces.Split(id, -1), "-")
		id = nonAlphaNum.ReplaceAllString(id, "")
		s := fmt.Sprintf(`<h3 id="%s"><a href="#%s">%s</a></h3>`, id, id, txt)
		if _, err := io.WriteString(w, s); err != nil {
			return ast.Terminate, false
		}
		return ast.SkipChildren, true

	case *ast.Text:
		s := hyphen.Hyphenate(string(n.Literal))
		if _, err := io.WriteString(w, s); err != nil {
			println(err.Error())
			return ast.Terminate, false
		}
		return ast.GoToNext, true

	case *ast.Paragraph:
		for _, c := range n.Children {
			if _, ok := c.(*ast.Image); ok {
				return ast.GoToNext, true
			}
		}
	}

	return ast.GoToNext, false
}

func hyphenator() hyphenate.Hyphenator {

	// This is a shy hyphen.
	hyphen := "\u00AD"

	h, err := hyphenate.New(
		"./src/hyphen/h_patterns.txt",
		hyphen,
		nil,
	)
	if err != nil {
		panic(err)
	}

	return h
}
