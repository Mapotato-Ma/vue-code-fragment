//需求背景：并发多个异步操作，如果有失败的，则重试失败，直到所有请求成功，或者超出最大次数，就返回
//异步请求1
//f1,f2,f3为三个模拟的异步操作
function f1(params) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(1, params)
            let _num = Math.random() * 2

            reject(1)

        }, 1000)
    })
}
function f2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(2)
            let _num = Math.random() * 2

            resolve(2)

        }, 1500)
    })

}
function f3() {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(3)
            let _num = Math.random() * 2
            reject(3);
        }, 2000)
    })
}
//并发工具类
class requestlist {
    list = [];
    map = {};
    que = [];
    success = [];
    err = [];
    constructor(list, reTryTime = 3) {
        this.list = list
        this.list.forEach((item, index) => {
            //给每个方法生成一个内部id，用来定位是哪个方法失败了
            let _id = "id_" + index;
            //用id形成map，方便后续根据id找到方法
            this.map[_id] = item;
            //把id给到方法静态属性
            item.id = _id;
            //添加hasTry和reTry，用于限制次数，使用者可以传入最大限制，默认三次
            item.hasTry = 0;
            item.reTry = reTryTime;
        })
    }
    createPromise(fn) {
        //用于给方法返回的promise在包一层promise，来携带出错方法的id
        return new Promise((resolve, reject) => {
            fn().then((res) => {
                resolve({
                    id: fn.id,
                    value: res
                })
            }).catch((err) => {
                reject({
                    id: fn.id,
                    value: err
                })
            })
        })
    }
    send() {
        //发请求的队列
        let _que = [];
        //第一次调用，所有方法都组成发送队列
        this.list.forEach((fn) => {
            _que.push(this.createPromise(fn))
        })
        //return Promise方便使用者接受
        return new Promise((resolve, reject) => {
            //批量发送方法，批量发送所有请求
            let sendAllSettled = () => {
                Promise.allSettled(_que).then((resList) => {
                    //发送完毕，清空队列
                    _que = []
                    //查看结果
                    resList.forEach((sing) => {
                        //如果已经成功，则把结果加入成功数组
                        if (sing.status == 'fulfilled') {
                            this.success.push(sing.value.value)
                        } else {
                            //如果失败，则根据id找出原方法
                            let _id = sing.reason.id;
                            let _fn = this.map[_id]
                            //判断原方法是否超过最大重试次数
                            if (_fn.hasTry < _fn.reTry) {
                                //如果没超过则，把失败的方法加入队列，准备再发
                                _que.push(this.createPromise(_fn))
                                _fn.hasTry += 1;
                            } else {
                                //如果已经大于最大次数了，则把结果加入失败数组
                                this.err.push(sing.reason.value);
                            }
                        }
                    })

                    if (_que.length == 0) {
                        //如果前面循环下来，_que没有内容，则代表没有失败的请求，或者已经超出最大次数
                        //直接把结果按成功失败归类放回
                        resolve({
                            success: this.success,
                            error: this.err
                        })
                    } else {
                        //如果还有需要重发的，则递归自身，再次把队列发送
                        sendAllSettled()
                    }
                })
            }
            sendAllSettled()
        })
    }
}
//初始化并发工具类，给如要并发的请求，并且调用send方法发送，then接受结果
//需要携带参数的方法，借助bind携带参数
new requestlist([f1.bind(this, { a: 1 }), f2, f3], 5).send().then((res) => {
    console.log(res);
})
