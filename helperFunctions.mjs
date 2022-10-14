 export default function userFilter(req) {
    let filter = {};
    if (req.query._id !== undefined) {
        filter._id = req.query._id;
    } if (req.query.name !== undefined) {
         filter.name = req.query.name;
    } if (req.query.age !== undefined) {
         filter.age = req.query.age;
    } if (req.query.email !== undefined) {
        filter.email = req.query.email ;
    } if (req.query.phoneNumber !== undefined) {
        filter.phoneNumber = req.query.phoneNumber ;
    }  
    return filter;
}