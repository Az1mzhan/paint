const isNum = (ch) => {
    return ch >= '0' && ch <= '9';
}

const parseColor = (rgbColor) => {
    let rgb = [[], [], []];
    let cnt = 0;
    for (let i = 0; i < rgbColor.length; ++i) {
        if (isNum(rgbColor[i])) {
            rgb[cnt].push(rgbColor[i]);
            if (!isNum(rgbColor[i + 1]) && i !== rgbColor.length - 1)
                ++cnt;
        }
    }
    let ans = ['','',''];
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < rgb[i].length; ++j)
            ans[i] = ans[i].concat('', rgb[i][j]);
    }
    for (let i = 0; i < 3; ++i)
        ans[i] = parseInt(ans[i]);
    return ans;
};

export default parseColor;