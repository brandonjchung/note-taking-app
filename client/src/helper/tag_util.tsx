import { createTag, getTags, updateTag, deleteTag } from "../api/tagsApi"
import { Dispatch, SetStateAction } from "react"
import { Tag } from "../App";

type onAddTagProps = {
    label: string, 
    setTags: Dispatch<SetStateAction<Tag[]>>
}

export async function onAddTag({ label, setTags }: onAddTagProps){
    const res = await createTag(label);
    if(res){
        const tagData = await getTags();
        if(tagData){
            setTags(tagData);
            return tagData;
        }
    }
    return null

    // setTags(prevTags => {
    //     return [...prevTags, data]
    // })
}

type onUpdateTagsProps = {
    data: Tag, 
    setTags: Dispatch<SetStateAction<Tag[]>>
}

export function onUpdateTag({ data, setTags }: onUpdateTagsProps){
    updateTag(data).then((res) => {
        if(res){
            setTags((prevTags: Tag[]) => {
                return prevTags.map(tag => {
                    if(tag._id == data._id){
                        return data;
                    }
                    return tag;
                });
            });
        }
    });
}

type onDeleteTagProps = {
    id : string,
    setTags: Dispatch<SetStateAction<Tag[]>>, 
}

export function onDeleteTag({ id, setTags }: onDeleteTagProps){
    deleteTag(id).then((res) => {
        if(res != null){
            setTags(prevTags => {
                return prevTags.filter(tag => tag._id != id)
            })
        }
    });
}