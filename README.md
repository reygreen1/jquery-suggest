## jQuery-Suggest

jQuery-Suggest 是一个基于 jQuery 的 suggest 组件，它主要为 PC 端的搜索框提供建议词条。

### 为什么要做这个组件

我曾经做过一个基于 Zepto 简洁实用的 suggest 组件：[zepto-suggest](https://github.com/reygreen1/zepto-suggest)。

这个组件稍微改造即可在 jQuery 下使用（`目前版本已经支持`），但是问题是，PC 上的操作方式同移动端还是有很大差异的。如果业务突然要用基于 jQuery 的 PC 端 suggest，就会发现手头没有很好的代码可用，这是个问题。

而我们过去有基于 Qwrap 的 suggest 组件，经过长时间业务使用，已经比较成熟，所以有了将它改造为 jQuery 版本的想法。

经过两天的修改、调试和修复 bug，基本完成了大部分工作。

### 基本使用方法

1. 引入必要的 css 和 html。
	
	你可以根据自己项目中的情况灵活调整，那些不适用默认值的配置项，只需要在初始化组件的适合明确配置即可。

	我在 suggest-simple.html 中提供了一份简单的示例，仅供参考。

2. 引入必要的类库

	目前在最小范围内你至少需要两个 js 文件（ jQuery 框架和 suggest 组件）。

	可以参考如下方式：

	```javascript
		<script src="./jquery-1.11.3.js"></script>
    	<script type="text/javascript" src="./suggest.js"></script>
	```

	示例中我使用的都是本地文件，jQuery 使用的版本是 1.11.3。

	上线前记得压缩代码，或者使用线上的已有业务代码。

3. 实例化组件
	
	实例化组件将使页面中的指定元素具有 suggest 的功能。

	可如下初始化组件：

	```javascript
	var suggest = new Suggest($("#search-kw"), {});
	```
	Suggest 的第一个参数是页面中需要绑定 suggest 功能的元素（一般是一个 input）。第二个参数是配置参数对象，其中可以配置的属性可以参考下文内容。


### 组件定制

对于特殊的业务，如果默认配置满足不了需求，就需要进行组件的定制。

根据操作的复杂程度，有两种定制方式：

1. 简单的定制
	
	通过组件提供的大量配置项来具体化组件的业务逻辑，只需要参考可供使用配置项的相关说明，可满足大部分业务需求。

	suggest-simple.html 中展示的例子可以看做一个简单的定制化的 suggest 组件。

	具体代码可以自行下载参考。

2. 复杂的功能定制

	当通过配置项的相关修改已经不能满足你的需求时，我建议先考虑下业务逻辑是否可以进行拆分，将功能细分独立后通过其他组件框架或者技术来实现功能间的交流。

	suggest-jquery.html 中展示的是一个比较复杂的定制化 suggest 。组件在这里是作为其他功能的子功能出现的，其中还使用了 [jQuery-tmpl](https://github.com/BorisMoore/jquery-tmpl) 组件(当然你可以使用自己喜欢的模板组件)。

	如果有时间可以去看看里面的具体逻辑。

### 可使用的配置项

组件中可以使用的配置项如下：


* `data_url`           :  <string>   提供数据的 url ,默认为空

* `suggest_data`       :  <json array> 数据组，json 格式，默认为 {} , 与 data_url 必有一个可用

* `prefix_protected`   :  <boolean> 前缀保护，为 true 时，已经搜索过的不匹配词，再做增长，一律不作响应。默认为 true
		 
* `lazy_suggest_time`  :  <int> 每次按键出 suggest 时间，默认 100 毫秒。 

* `min_word_length`    :  <int> 最低的字数，低于此字数不进行搜索，默认为零。 

* `item_selectors`     :  <string> 认为这些是 suggest 列表项，如果不设置是 li.fold-item

* `item_hover_style`   :  <string> suggest列表项鼠标经过的样式名 , 默认为'fold-hover' , 
         
* `auto_submit`        :  <boolean> 选中词或回车时自动提交，默认为否。 

* `pos_adjust`         :  <string> 分left , top , width , z-index 设置项,用于微调 suggest 框的位置 

* `get_data_fun`       :  <string> ajax 或 jsonp 或 remote_call , data_provider , 默认为 jsonp , 如果是 remote_call, 即尝试调用百度的方法, 如果是 data_provider,请提供 data_provider 字段，用以提供数据

* `ajax_jsonp`         :  <string> 在 jsonp 请求中重写回调函数的名字。这个值用来替代在 "callback=?" 这种 GET 或 POST 请求中 URL 参数里的 "callback" 部分，默认值为 "callback"

* `fill_data_fun`      :  <function> 如提供，将把 data 传给这个函数对象，要求返回值是一个 html，否则走默认的函数

* `render_data_fun`    :  <function> 如提供，将把现在的搜索词和 data 传给这个函数对象，要求返回值是一个 html ，否则走默认的函数

* `auto_fix_list_pos`  :  <bool> 默认为 true , true 在窗口改变大小时，自动更新列表位置, false 如果 css 保证了这一点。请设为 false，节省效率

* `suggest_list`       :  <$> 要求是一个列表的 container 的 jQuery 对象 , 如果不提供，默认为 $('<ul id="search-suggest" class="suggest"></ul>')

* `auto_submit`        :  <bool> true 选中列表值后自动调用所在 form 的 submit 方法，true 自动提交 false 不自动提交

* `remote_call_charset`:  <string> 远程数据服务使用的字符集编码 

* `remote_call_expire` :  <int> 远程数据服务失效时间（分钟），如果是零，信任服务器 header 头，默认为零 

* `emptyPrompt`        :  <boolean> 清空提示，这会导致组件不存储那些没有 suggest 的搜索词。默认值为 false。

* `onbeforesuggest`    :  <function> suggest 显示前的方法，可以用 this.getSuggestData 获得对象  

* `onaftersuggest`     :  <function> suggest 显示之后执行方法，可用 this.getSuggestData 获得对象

* `onafterinputchange` :  <function> input内容变化后执行的方法，如第一个参数为 e ，第二个参数为 oldword ，第三个参数为 newWord

* `onaftergetdata`     :  <function> suggest获取数据之后执行方法， 如第一个参数为 e , 第二个参数为 data ，则 data.rawdata 是刚刚取到的数据，如需加工，可以重新赋值给它

* `onbeforechoose`     :  <function> suggest用上下键选择之后执行方法， 如第一个参数为 e ，则 e.selectedDom 是正要选取的dom

* `onafterchoose`      :  <function> suggest用上下键选择之后执行方法， 如第一个参数为 e ，则 e.selectedDom 是选取的dom


## 版本更新历史

* v1.0.0 初始化。
