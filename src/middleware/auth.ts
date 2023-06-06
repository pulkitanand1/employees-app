import { verifyToken } from '../utils/authentication';

const auth = async (req: any, res: any, next: any) => {
    const token = req.header('Authorization')?.replace("Bearer ", "");
    if(token){
        const data = await verifyToken(token);
        if(data){
            next();
        }
        else{
            res.status(401).send({error: 'Not authenticated!'})
        }
    }
    else {
        res.status(401).send({error: 'Not authenticated!'})
 
    }

}
export default auth;