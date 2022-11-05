import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import type { EditorState } from 'lexical';
import { useEffect } from 'react';

import MentionsPlugin from './atMentionsPlugin';
import ErrorBoundary from './errorBoundary';
import { PLAYGROUND_TRANSFORMERS } from './markdownTransformers';
import { MentionNode } from './mentionsNode';
import ToolbarPlugin from './toolbarPlugin';
import { useList } from './useList';

const ListPlugin = (): null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ListNode, ListItemNode])) {
      throw new Error('ListPlugin: ListNode and/or ListItemNode not registered on editor');
    }
  }, [editor]);

  useList(editor);

  return null;
};

function onChange(editorState: EditorState) {
  editorState.read(() => {
    const markdown = $convertToMarkdownString(TRANSFORMERS);
    console.log(markdown);
  });
}
function onError(error: any) {
  console.error(error);
}

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}
export default function Editor() {
  const initialConfig = {
    namespace: 'composer',
    theme: {
      list: {
        listitem: 'ml-2',
        listitemChecked: 'line-through',
        listitemUnchecked: 'PlaygroundEditorTheme__listItemUnchecked',
        nested: {
          listitem: 'list-none ml-8'
        },
        olDepth: [
          'list-inside ml-4 list-decimal',
          'ml-4 list-[upper-alpha]',
          'ml-4 list-[lower-alpha]',
          'ml-4 list-[upper-roman]',
          'ml-4 list-[lower-roman]'
        ],
        ul: 'list-disc list-inside'
      },
      text: {
        bold: 'text-bold text-bold',
        code: 'text-code',
        italic: 'text-italic italic',
        strikethrough: 'text-strikethrough strikethrough',
        subscript: 'text-subscript subscript',
        superscript: 'text-superscript superscript',
        underline: 'text-underline underline',
        underlineStrikethrough: 'text-underline-strike-through underline line-through'
      },
      quote: ' mb-5 ml-10 border-brand-500 border-l-4 pl-4'
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      CodeNode,
      LinkNode,
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      MentionNode
    ],
    editorState: null,
    onError
  };

  return (
    <div className="relative">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="
          block w-[97%] m-4 box-border h-20 z-10 overflow-auto"
            />
          }
          placeholder={
            <div className="absolute z-0 text-gray-400 pointer-events-none select-text top-12 left-4 right-3 whitespace-nowrap">
              What's happening?
            </div>
          }
          ErrorBoundary={ErrorBoundary}
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        <ListPlugin />
        <MentionsPlugin />
        <MyCustomAutoFocusPlugin />
        <MarkdownShortcutPlugin transformers={PLAYGROUND_TRANSFORMERS} />
      </LexicalComposer>
    </div>
  );
}