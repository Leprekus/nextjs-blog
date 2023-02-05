import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory: string = path.join(process.cwd(), 'posts')
interface postObject {
    id: string,
    date: string
}
export function getSortedPostsData():object {
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
    return allPostsData.sort((a:postObject, b: postObject) => {
        if(a.date < b.date) {
            return 1;
        }
        return -1;
    })
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
  
    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ''),
        },
      };
    });
  }

  export async function getPostData(id: string) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
  
    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();
  
    // Combine the data with the id and contentHtml
    return {
      id,
      contentHtml,
      ...matterResult.data,
    };
  }