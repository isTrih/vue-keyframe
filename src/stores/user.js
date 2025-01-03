import {defineStore} from "pinia";
import {ref} from "vue";
import {login, queryUserFocus, Register} from "@/apis/main";

export const useUserStore = defineStore('user', () => {
    const userInfo = ref({});
    const userFocus = ref([]);
    const userCollect = ref([]);
    const userFavorite = ref([]);
    const headersObj = ref({})
    const userRegister = async ({mobile, username, password, verifyCode}) => {
        console.log(mobile, username, password, verifyCode);
        const resp = await Register({mobile, username, password, verifyCode});
        if (resp.code === 0) {
            userInfo.value = resp.data;
            headersObj.value = {Authorization: `Bearer ${userInfo.value.token}`}
            console.log(resp);
            return [resp.code, "注册成功"];
        } else {
            console.log(resp);
            return [resp.code, resp.msg]
        };
    };

    const getUserInfo = async ({mobile, password}) => {
        const resp = await login({mobile, password});
        if (resp.code === 0) {
            userInfo.value = resp.data;
            headersObj.value = {Authorization: `Bearer ${userInfo.value.token}`}
            // const focusResult = await queryUserFocus();
            // userFocus.value = focusResult.info.follow;
            // userCollect.value = focusResult.info.collected;
            // userFavorite.value = focusResult.info.favorites;
            console.log(resp);
            return [resp.code, "登录成功"];
        } else return [resp.code, resp.msg];
    };

    const extendUserInfo = (type, id) => {
        if (type === 1) {
            userFocus.value = [...userFocus.value, id];
        } else if (type === 2) {
            userFavorite.value = [...userFavorite.value, id];
        } else if (type === 3) {
            userCollect.value = [...userCollect.value, id];
        }
    };

    const removeFocus = (type, id) => {
        if (type === 1) {
            const index = userFocus.value.indexOf(id);
            if (index !== -1) {
                userFocus.value.splice(index, 1);
            }
        } else if (type === 2) {
            const index = userFavorite.value.indexOf(id);
            if (index !== -1) {
                userFavorite.value.splice(index, 1);
            }
        } else if (type === 3) {
            const index = userCollect.value.indexOf(id);
            if (index !== -1) {
                userCollect.value.splice(index, 1);
            }
        }
    };

    const userLogout = async () => {
        userInfo.value = {};
        return {info: "成功退出登录"};
    };

    const changeInfo = ({username, signature, avatar}) => {
        userInfo.value.username = username;
        userInfo.value.signature = signature;
        userInfo.value.avatar = avatar;
    };

    return {
        userInfo,
        getUserInfo,
        userLogout,
        userRegister,
        extendUserInfo,
        userFocus,
        removeFocus,
        changeInfo,
        userCollect,
        userFavorite,
        headersObj
    };
}, {
    persist: true,
});
