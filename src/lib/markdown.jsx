import React from "react";
import { MENTION_RE, mentionClass } from "./channels.js";

// Helper to format URLs for href (adding https:// if needed)
function formatHref(url) {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return "https://" + url;
}

// Trims trailing punctuation and unmatching parentheses/brackets from URLs
function trimUrl(url) {
  let trimmed = "";
  let currentUrl = url;

  while (currentUrl.length > 0) {
    const lastChar = currentUrl[currentUrl.length - 1];
    
    if (/[.,?!;:"']/.test(lastChar)) {
      trimmed = lastChar + trimmed;
      currentUrl = currentUrl.slice(0, -1);
    } else if (lastChar === ')') {
      const openCount = (currentUrl.match(/\(/g) || []).length;
      const closeCount = (currentUrl.match(/\)/g) || []).length;
      if (closeCount > openCount) {
        trimmed = lastChar + trimmed;
        currentUrl = currentUrl.slice(0, -1);
      } else {
        break;
      }
    } else if (lastChar === ']') {
      const openCount = (currentUrl.match(/\[/g) || []).length;
      const closeCount = (currentUrl.match(/\]/g) || []).length;
      if (closeCount > openCount) {
        trimmed = lastChar + trimmed;
        currentUrl = currentUrl.slice(0, -1);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return { url: currentUrl, trimmed };
}

function findEarliestMatch(text) {
  const rules = [
    { type: "boldItalic", regex: /\*\*\*([\s\S]+?)\*\*\*/ },
    { type: "bold", regex: /\*\*([\s\S]+?)\*\*/ },
    { type: "underline", regex: /__([\s\S]+?)__/ },
    { type: "italic", regex: /\*([\s\S]+?)\*/ },
    { type: "link", regex: /\[([\s\S]+?)\]\(([^)]+?)\)/ },
    { type: "mention", regex: MENTION_RE },
    { type: "plainUrl", regex: /\b(?:https?:\/\/|www\.)[^\s<>]+/i }
  ];

  let earliest = null;

  for (const rule of rules) {
    rule.regex.lastIndex = 0;
    const match = rule.regex.exec(text);
    if (match) {
      let index = match.index;
      let matchedText = match[0];
      let captures = match.slice(1);

      if (rule.type === "plainUrl") {
        const trimmedResult = trimUrl(matchedText);
        if (trimmedResult.trimmed) {
          matchedText = trimmedResult.url;
          captures = [trimmedResult.url];
        }
      }

      if (earliest === null || index < earliest.index) {
        earliest = {
          type: rule.type,
          index,
          length: matchedText.length,
          text: matchedText,
          captures
        };
      } else if (index === earliest.index) {
        const currentRuleIndex = rules.findIndex(r => r.type === rule.type);
        const earliestRuleIndex = rules.findIndex(r => r.type === earliest.type);
        if (currentRuleIndex < earliestRuleIndex) {
          earliest = {
            type: rule.type,
            index,
            length: matchedText.length,
            text: matchedText,
            captures
          };
        }
      }
    }
  }

  return earliest;
}

export function parseMarkdown(text, options = {}) {
  const { isBackdrop = false, renderMentions = true } = options;

  let keyCounter = 0;

  function parse(str) {
    if (!str) return [];

    const match = findEarliestMatch(str);
    if (!match) {
      return [str];
    }

    const before = str.slice(0, match.index);
    const after = str.slice(match.index + match.length);

    const result = [];
    if (before) {
      result.push(...parse(before));
    }

    const key = `md-${match.type}-${keyCounter++}`;

    if (match.type === "boldItalic") {
      const content = match.captures[0];
      if (isBackdrop) {
        result.push(
          <span key={key}>
            <span className="md-tag">***</span>
            <strong><em>{parse(content)}</em></strong>
            <span className="md-tag">***</span>
          </span>
        );
      } else {
        result.push(
          <strong key={key}>
            <em>{parse(content)}</em>
          </strong>
        );
      }
    } else if (match.type === "bold") {
      const content = match.captures[0];
      if (isBackdrop) {
        result.push(
          <span key={key}>
            <span className="md-tag">**</span>
            <strong>{parse(content)}</strong>
            <span className="md-tag">**</span>
          </span>
        );
      } else {
        result.push(<strong key={key}>{parse(content)}</strong>);
      }
    } else if (match.type === "underline") {
      const content = match.captures[0];
      if (isBackdrop) {
        result.push(
          <span key={key}>
            <span className="md-tag">__</span>
            <u>{parse(content)}</u>
            <span className="md-tag">__</span>
          </span>
        );
      } else {
        result.push(<u key={key}>{parse(content)}</u>);
      }
    } else if (match.type === "italic") {
      const content = match.captures[0];
      if (isBackdrop) {
        result.push(
          <span key={key}>
            <span className="md-tag">*</span>
            <em>{parse(content)}</em>
            <span className="md-tag">*</span>
          </span>
        );
      } else {
        result.push(<em key={key}>{parse(content)}</em>);
      }
    } else if (match.type === "link") {
      const linkText = match.captures[0];
      const linkUrl = match.captures[1];
      const href = formatHref(linkUrl);
      if (isBackdrop) {
        result.push(
          <span key={key}>
            <span className="md-tag">[</span>
            <span className="md-link-text">{parse(linkText)}</span>
            <span className="md-tag">]({linkUrl})</span>
          </span>
        );
      } else {
        result.push(
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="md-link">
            {parse(linkText)}
          </a>
        );
      }
    } else if (match.type === "mention") {
      const mention = match.captures[0];
      if (renderMentions) {
        result.push(
          <mark key={key} className={"ment " + mentionClass(mention)}>
            {"@" + mention}
          </mark>
        );
      } else {
        result.push(`@${mention}`);
      }
    } else if (match.type === "plainUrl") {
      const url = match.text;
      const href = formatHref(url);
      if (isBackdrop) {
        result.push(
          <span key={key} className="md-link-text">
            {url}
          </span>
        );
      } else {
        result.push(
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="md-link">
            {url}
          </a>
        );
      }
    }

    if (after) {
      result.push(...parse(after));
    }

    return result;
  }

  return parse(text);
}
