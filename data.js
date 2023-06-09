

module.exports.getDate= function(){
    const d = new Date();
    const week =["Sunday","Monday","Tuesday","Wednesday","Thusday","Friday","Saturday"];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let day = week[d.getDay()];
    let month = d.getMonth() ;
    let date = d.getDate();
    let currentDate = day+", "+ months[month]+ date;
    return currentDate;
}
   