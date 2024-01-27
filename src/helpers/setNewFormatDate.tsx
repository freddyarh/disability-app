
export const setNewFormatDate = (today: Date, time = false ) => {
    
    let newDate = today.toISOString().split('T')[0].split("-").join("/"); 

    if( time ){
        let [hour, minute] = today.toISOString().split('T')[1].split(".")[0].split(":");
        return `${newDate} ${hour}:${minute}`;
    };
    
    return newDate;
};