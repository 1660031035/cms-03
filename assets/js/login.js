/*  toastr.info('普通提示')
    toastr.success('成功提示')
    toastr.warning('警告提示')
    toastr.error('错误提示') */


// 需求1: 点击切换登录注册页.
let a1 = document.querySelector('.register a')
let a2 = document.querySelector('.login a')
let register = document.querySelector('.register')
let login = document.querySelector('.login')
// 1.1 当点击a2时,也就是点击登录页时 切换注册页
a2.onclick = function () {
    login.style.display = 'none'
    register.style.display = 'block'
}
// 1.2 当点击a1时,也就是点击注册页时,切换登录页.
a1.onclick = function () {
    login.style.display = 'block'
    register.style.display = 'none'
}

// 需求2: 用户名和密码框的非空判断和正则校验
let input1 = document.querySelector('.register [type="text"]')
let input2 = document.querySelector('.register [type="password"]')
let input3 = document.querySelector('.login [type="text"]')
let input4 = document.querySelector('.login [type="password"]')
// 2.1 封装input事件函数
function check(ipt, info, reg, num) {
    // 2.2 注册input事件
    ipt.oninput = function () {
        // 2.3 非空判断
        if (this.value == '') {
            this.nextElementSibling.style.display = 'block'
            this.nextElementSibling.innerText = `${info}不能为空`
            return // 如果满足非空判断的条件, 后面的代码就不再执行了
        } else {
            this.nextElementSibling.style.display = 'none'
            this.nextElementSibling.innerText = ''
        }
        // 2.4 正则校验 /$\S[2,15]^/
        if (reg.test(this.value)) {
            this.nextElementSibling.style.display = 'none'
            this.nextElementSibling.innerText = ''
        } else {
            this.nextElementSibling.style.display = 'block'
            this.nextElementSibling.innerText = `${info}长度不能小于${num}位或超过15位`
        }
    }
}
// 2.5 调用函数
check(input1, '用户名', /^\S{2,15}$/, 2)
check(input2, '密码', /^\S{6,15}$/, 6)
check(input3, '用户名', /^\S{2,15}$/, 2)
check(input4, '密码', /^\S{6,15}$/, 6)

// 需求3: 注册功能 点击注册发送ajax请求
document.querySelector('.register .btn').addEventListener('click', function (e) {
    // 3.1 阻止表单默认事件
    e.preventDefault()
    // 3.2 发送ajax请求
    axios({
        url: '/api/register',
        method: 'post',
        data: {
            username: input1.value,
            password: input2.value
        },
    }).then(({
        data: res
    }) => {
        // 成功回调
        if (res.code == 0) {
            // 注册成功提示
            toastr.success(res.message)
            // 清空表单
            document.querySelector('.register form').reset()
            // 跳转登录页
            a1.onclick()
        }
    })
})

// 需求4: 登录功能
document.querySelector('.login .btn').addEventListener('click', function (e) {
    // 4.1 阻止表单默认事件
    e.preventDefault()
    // 4.2 发送ajax请求
    axios({
        url: '/api/login',
        method: 'post',
        data: {
            username: input3.value,
            password: input4.value
        },
    }).then(({
        data: res
    }) => {
        //成功回调
        if (res.code == 0) {
            // 登录成功提示
            toastr.success(res.message)
            // 清空表单
            document.querySelector('.register form').reset()
            // 跳转登录页
            location.href = 'index.html'
            // 保存token
            localStorage.setItem('token',res.token)
        }
    })
})