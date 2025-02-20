import { createTag, createTags, getTags, updateTag, updateTags, deleteTag, deleteTags } from "../api/tagsApi"
import { Dispatch, SetStateAction } from "react"
import { Tag } from "../types/tag";

type onCreateTagProps = {
    label: string, 
    userId: string,
    setTags: Dispatch<SetStateAction<Tag[]>>
}

export async function onCreateTag({ label, userId, setTags }: onCreateTagProps){
    const res = await createTag({label, userId});
    if(res){
        const tagData = await getTags(userId);
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
    userId: string,
    setTags: Dispatch<SetStateAction<Tag[]>>
}

export async function onCreateTags({ tagsToCreate, userId, setTags }: onCreateTagsProps){
    const res = await createTags(tagsToCreate, userId);
    if(res){
        const tagData = await getTags(userId);
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
                return prevTags.filter(tag => !ids.includes(tag._id))
            })
        }
    });
}