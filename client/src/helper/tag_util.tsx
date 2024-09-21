import { createTag, createTags, getTags, updateTag, updateTags, deleteTag, deleteTags } from "../api/tagsApi"
import { Dispatch, SetStateAction } from "react"
import { Tag } from "../App";

type onCreateTagProps = {
    label: string, 
    setTags: Dispatch<SetStateAction<Tag[]>>
}

export async function onCreateTag({ label, setTags }: onCreateTagProps){
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

type onCreateTagsProps = {
    tagsToCreate: string[], 
    setTags: Dispatch<SetStateAction<Tag[]>>
}

export async function onCreateTags({ tagsToCreate, setTags }: onCreateTagsProps){
    const res = await createTags(tagsToCreate);
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

type onUpdateTagProps = {
    data: Tag, 
    setTags: Dispatch<SetStateAction<Tag[]>>
}

export function onUpdateTag({ data, setTags }: onUpdateTagProps){
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

type onUpdateTagsProps = {
    tagsToUpdate: Tag[], 
    setTags: Dispatch<SetStateAction<Tag[]>>
}

export function onUpdateTags({ tagsToUpdate, setTags }: onUpdateTagsProps){
    updateTags(tagsToUpdate).then((res) => {
        if(res){
            setTags(tagsToUpdate);
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

type onDeleteTagsProps = {
    ids : string[],
    setTags: Dispatch<SetStateAction<Tag[]>>, 
}

export function onDeleteTags({ ids, setTags }: onDeleteTagsProps){
    deleteTags(ids).then((res) => {
        if(res != null){
            setTags(prevTags => {
                return prevTags.filter(tag => ids.includes(tag._id))
            })
        }
    });
}