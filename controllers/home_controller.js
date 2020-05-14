//Controller for the Home or Dashboard
module.exports.home = async function(req,res){
    return res.render('home',{
        title:"Autentication System | Home",
        user:req.user,
    });
}