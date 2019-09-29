export default {
    getQuery() {
        /* 获取当前路由栈数组 */
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        console.log(currentPage,options)
        const options = currentPage && currentPage.options ? currentPage.options : {}
        console.log(options)
        return options
    },
    mobileVerify(mobile) {
        // 手机号验证
        if (mobile == '') {
            uni.showToast({icon: 'none', title: '请填写你的手机号'});
            return true;
        } else if (!/^1\d{10}$/.test(mobile)) {
            uni.showToast({icon: 'none', title: '请填写正确的手机号'});
            return true;
        }
        return false;
    },
    productNull(id, isProduct) {
        // 无id
        if (!id) {
            if (isProduct) {
                uni.redirectTo({
                    url: '/pages/products/main'
                });
            }else {
                uni.redirectTo({
                    url: '/pages/casedetail/main'
                });

            }
            return true;
        }
        return false;
    },
    formatDate: function (value) {
        // 时间格式
        let date = new Date(value - 0);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
    }
     
}