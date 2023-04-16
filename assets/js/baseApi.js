/**ajaxPrefilter()解析
 * 1. 注意： 每次调用jQuery里面的 $.get() 或 $.post() 或 $.ajax() 的时候， 
 * 2. 都会先执行调用 ajaxPrefilter() 这个函数
 * 3. 这个函数执行的时候， 可以获取到我们给Ajax提供的配置对象(options)
 * 4. 所以只有这个函数执行执行完毕后，才会发起真正的请求, 
 * 5. 所以在利用这个函数的特性， 在发器真正的请求的时候，我们可以拼接URL等等
 */

$.ajaxPrefilter(function(options) {
    console.log(options.url);
    // 在发起真正的 Ajax 请求之前，进行统一拼接请求的根路径
    options.url = "http://www.liulongbin.top:3007" + options.url;
    console.log(options.url);
})
