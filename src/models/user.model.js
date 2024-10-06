const users = [];

// 유저 추가
export const addUser = (user) => {
    users.push(user);
};

// 유저 로그아웃
export const removeUser =(socketId) => {
    const index = users.findIndex((user) => user.socketId === socketId);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

// 유저 조회
export const getUser =() => {
    return users;
};