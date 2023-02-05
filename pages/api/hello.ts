
export default function handler(req:string, res:any):void {
    res.status(200).json({ text: 'Hello' });
  }