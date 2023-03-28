const date = date => {
    date = new Date(date);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
};

export { date };
