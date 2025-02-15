export function stringifyDate(d) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = d.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
}

export function addDays(d, days) {
    const newDate = new Date(d);
    newDate.setDate(d.getDate() + days);
    return newDate;
}