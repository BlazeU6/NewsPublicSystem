import React,{useEffect, useState} from 'react'
import { convertToRaw,ContentState,EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg'
import htmlToDraft from 'html-to-draftjs'

export default function NewsEdit(props) {
    const [editorState,setEditorState] = useState("")

    useEffect(()=>{
        const html = props.content
        if(!html) return;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    },[props.content])
    return (
        <div style={{
            padding:"30px",
            border:"1px solid #f0f2f5",
            color:"#000"
        }}>
            <Editor
                style={{
                    border:"1px solid #f0f2f5"
                }}
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState)=>{
                    setEditorState(editorState)
                }}
                onBlur={()=>{
                    let content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
                    props.getContent(content)
                }}
            />
        </div>
    )
}
