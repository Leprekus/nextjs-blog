import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory: string = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
    //gets file names under /posts
    const fileNames: string[] = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map(fileName => {
        //remove .md from file to get id
        const id: string = fileName.replace(/\.md$/, '')

        //read md file as string
        const fullPath: string = path.join(postsDirectory, fileName)
        const fileContents: string = fs.readFileSync(fullPath, 'utf8')

        //parse post metadata Section using gray matter
        const matterResult = matter(fileContents);

        return {
            id, 
            ...matterResult.data
        }
    })
    return allPostsData.sort((a, b) => {
        if(a.date < b.date) {
            return 1;
        }
        return -1;
    })
}