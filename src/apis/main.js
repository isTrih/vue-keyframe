import http from "@/utils/http";

// 登录
export const login = ({mobile, password}) => {
    return http({
        url: '/user/login-mobile-pass',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "mobile": mobile,
            "password": password
        }
    })
}

// 获取验证码
export const Verifycode = (mobile) => {
    return http({
        url: '/user/verify-code',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "mobile": mobile,
        }
    })
}

// 注册
export const Register = ({mobile, username, password, verifyCode}) => {
    console.log(mobile, username, password, verifyCode)
    return http({
        url: '/user/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "user_name": username,
            "password": password,
            "mobile": mobile,
            "verifyCode": verifyCode
        }
    })
}

// 访问用户主页
export const queryUserIndex = (id) => {
    return http({
        url: '/user/info/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "user_id": parseInt(id)
        }
    })
}

// TODO:上传帖子
export const uploadPost = (data) => {
    return http({
        url: '/upload/info/',
        method: 'POST',
        data: data
    })
}

// TODO:帖子详情
export const postDetail = ({id}) => {
    return http({
        url: '/post/detail/',
        method: 'POST',
        data: {
            id
        }
    })
}

// TODO:主页帖子
export const queryPost = (offset, query) => {
    let arg = ""
    if (query) {
        arg = query
    }
    return http({
        url: '/home/get-feeds',
        method: 'POST',
        header: {
            'Content-Type': 'application/json'  //如果写成contentType会报错
        },
        data: {
            "offset": offset,
            "query": arg
        }
    })
}

// TODO:评论帖子
export const doComment = ({data}) => {
    return http({
        url: '/comment/',
        method: 'POST',
        data: data
    })
}

// TODO:用户关注
export const doFocus = ({id}) => {
    return http({
        url: '/focus/',
        method: 'POST',
        data: {id}
    })
}

// TODO:获取用户关注
export const queryUserFocus = () => {
    return http({
        url: '/user/focus/',
        method: 'GET',
    })
}

// TODO:取消关注
export const unFollow = ({id}) => {
    return http({
        url: '/user/unfollow/',
        method: 'POST',
        data: {id}
    })
}

// TODO:更新用户信息
export const updateUserInfo = ({username, signature}) => {
    return http({
        url: '/user/update/',
        method: 'POST',
        data: {
            username,
            signature
        }
    })
}

//用户主页的三个类型
export const queryUserPost = ({user_id, types, offset}) => {
    return http({
        url: '/home/userfeeds/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "user_id": parseInt(user_id),
            "feed_type": types,
            "offset": offset
        }
    })
}

export const controlUserCollectOrLike = ({post_id, operator, type}) => {
    return http({
        url: '/post/control/',
        method: 'POST',
        data: {
            post_id,
            type,
            operator
        }
    })
}

export const getComment = ({id, offset}) => {
    return http({
        url: '/comment/main/',
        method: 'POST',
        data: {
            id,
            offset
        }
    })
}

export const queryUserPostControl = ({offset, types}) => {
    return http({
        url: '/user/post/control/',
        method: 'POST',
        data: {
            offset,
            types
        }
    })
}

export const postDelete = ({id}) => {
    return http({
        url: '/post/delete/',
        method: 'POST',
        data: {
            id
        }
    })
}

export const removeFan = ({id}) => {
    return http({
        url: '/user/remove/fan/',
        method: 'POST',
        data: {
            id
        }
    })
}

// 加载评论
export const loadReplies = ({id, offset}) => {
    return http({
        url: '/comment/reply/',
        method: 'POST',
        data: {
            id,
            offset
        }
    })
}
