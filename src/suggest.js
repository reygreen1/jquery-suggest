/**
 * @method suggest 搜索建议 jQuery版本
 * @version 1.0.0 基于Qwrap suggest v0.4.2
 * @param dom   <$dom>  响应suggest的控件
 * @param opts  <object> 配置表
 *        "data_url"           :  <string>   提供数据的url,默认为空
 *        "suggest_data"       :  <json array> 数据组，json格式，默认为{} , 与data_url必有一个可用
 *        "prefix_protected    :  <boolean> 前缀保护，为true时，已经搜索过的不匹配词，再做增长，一律不作响应。默认为true
 *        "item_selectors"     :  <string> 认为这些是suggest列表项，如果不设置是li.fold-item
 *        "lazy_suggest_time"  :  <int> 每次按键出suggest时间，默认100毫秒。 
 *        "min_word_length"    :  <int> 最低的字数，低于此字数不进行搜索，默认为零。 
 *        "auto_submit"        :  <boolean> 选中词或回车时自动提交，默认为否。 
 *        "item_hover_style"   :  <string> suggest列表项鼠标经过的样式名 , 默认为'fold-hover' , 
 *        "pos_adjust"         :  <string> 分left , top , width , z-index 设置项,用于微调 suggest 框的位置 
 *        "get_data_fun"       :  <string> ajax 或 jsonp或 remote_call , data_provider , 默认为jsonp , 如果是remote_call,即尝试调用百度的方法,如果是data_provider,请提供data_provider字段，用以提供数据
 *        "ajax_jsonp"         :  <string> 在 jsonp 请求中重写回调函数的名字。这个值用来替代在 "callback=?" 这种 GET 或 POST 请求中 URL 参数里的 "callback" 部分，默认值为 "callback"
 *        "fill_data_fun"      :  <function> 如提供，将把data传给这个函数对象，要求返回值是一个html，否则走默认的函数,
 *        "render_data_fun"    :  <function> 如提供，将把现在的搜索词和data传给这个函数对象，要求返回值是一个html，否则走默认的函数,
 *        "auto_fix_list_pos"  :  <bool> 默认为true , true 在窗口改变大小时，自动更新列表位置,false-如果css保证了这一点。请设为false，节省效率
 *        "suggest_list"       :  <$> 要求是一个列表的container的jQuery对象 , 如果不提供，默认为$('<ul id="search-suggest" class="suggest"></ul>')
 *        "auto_submit"        :  <bool> true 选中列表值后自动调用所在form的submit方法，true-自动提交 false-不自动提交
 *        "remote_call_charset":  <string> 远程数据服务使用的字符集编码 
 *        "remote_call_expire" :  <int> 远程数据服务失效时间（分钟），如果是零，信任服务器header头，默认为零 
 *        "emptyPrompt"        :  <boolean> 清空提示，这会导致组件不存储那些没有 suggest 的搜索词。默认值为 false。
 *        "onbeforesuggest"    :  <function> suggest显示前的方法，可以用 this.getSuggestData 获得对象  
 *        "onaftersuggest"     :  <function> suggest显示之后执行方法，可用 this.getSuggestData 获得对象
 *        "onafterinputchange" :  <function> input内容变化后执行的方法，如第一个参数为e，第二个参数为 oldword ，第三个参数为 newWord
 *        "onaftergetdata"     :  <function> suggest获取数据之后执行方法， 如第一个参数为e , 第二个参数为 data，则 data.rawdata 是刚刚取到的数据，如需加工，可以重新赋值给它
 *        "onbeforechoose"     :  <function> suggest用上下键选择之后执行方法， 如第一个参数为e ，则 e.selectedDom 是正要选取的dom
 *        "onafterchoose"      :  <function> suggest用上下键选择之后执行方法， 如第一个参数为e ，则 e.selectedDom 是选取的dom
 */

;(function($, window, undefined) {
  var noEventKeycode = [9, 16, 17, 18, 19, 20, 33, 34, 35, 36, 37, 39, 41, 42, 43, 45, 47],
    camelize = function(s) {
      return $.camelCase(s.replace(/_/g, '-'));
    },
    stripTags = function(s) {
      return s.replace(/<[^>]+>/gi, '');
    },
    genDomId = (function() {
      var myId = +new Date();

      return function() {
        return ++myId;
      }
    }()), 
    stringify = (function(){
    	/**
    	 * stringifyJSON
    	 * http://github.com/flowersinthesand/stringifyJSON
    	 */
    	var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, 
			meta = {
				'\b' : '\\b',
				'\t' : '\\t',
				'\n' : '\\n',
				'\f' : '\\f',
				'\r' : '\\r',
				'"' : '\\"',
				'\\' : '\\\\'
			};
	
		function quote(string) {
			return '"' + string.replace(escapable, function(a) {
				var c = meta[a];
				return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"';
		}
		
		function f(n) {
			return n < 10 ? "0" + n : n;
		}
		
		function str(key, holder) {
			var i, v, len, partial, value = holder[key], type = typeof value;
					
			if (value && typeof value === "object" && typeof value.toJSON === "function") {
				value = value.toJSON(key);
				type = typeof value;
			}
			
			switch (type) {
				case "string":
					return quote(value);
				case "number":
					return isFinite(value) ? String(value) : "null";
				case "boolean":
					return String(value);
				case "object":
					if (!value) {
						return "null";
					}
					switch (Object.prototype.toString.call(value)) {
						case "[object Date]":
							return isFinite(value.valueOf()) ? 
								'"' + value.getUTCFullYear() + "-" + f(value.getUTCMonth() + 1) + "-" + f(value.getUTCDate()) + 
								"T" + f(value.getUTCHours()) + ":" + f(value.getUTCMinutes()) + ":" + f(value.getUTCSeconds()) + "Z" + '"' : 
								"null";
						case "[object Array]":
							len = value.length;
							partial = [];
							for (i = 0; i < len; i++) {
								partial.push(str(i, value) || "null");
							}
							
							return "[" + partial.join(",") + "]";
						default:
							partial = [];
							for (i in value) {
								if (Object.prototype.hasOwnProperty.call(value, i)) {
									v = str(i, value);
									if (v) {
										partial.push(quote(i) + ":" + v);
									}
								}
							}
							
							return "{" + partial.join(",") + "}";
					}
			}
		}
	
		function stringifyJSON(value) {
			if (window.JSON && window.JSON.stringify) {
				return window.JSON.stringify(value);
			}
			
			return str("", {"": value});
		}

		return stringifyJSON;
    }());;

  function Suggest(dom, opts) {
    this._dom = dom;
    this.init(opts);
  }

  Suggest.Version = '1.0.0';

  Suggest.prototype = {
    /*默认属性*/
    dataUrl: "",
    curIndex: 0,
    suggestData: {},
    prefixProtected: true,
    lazySuggestTime: 100,
    minWordLength: 0,
    itemSelectors: "li.fold-item",
    itemHoverStyle: "fold-hover",
    itemFakeClass: "fake",
    itemNoneClass: "error",
    posAdjust: {},
    getDataFun: "jsonp",
    ajax_jsonp: "callback",
    remoteCall: "baidu.sug",
    remoteCallCharset: "gbk",
    remoteCallExpire: 0, 
    autoFixListPos: true,
    autoSubmit: false,
    suggestProtectedTimer: false,
    invalidWords: {},
    history: {},
    inputWord: "",
    isAutoOppDir: true,
    emptyPrompt: false,
    trimKW: false,
    _parsing: 0,
    _suggestTimer: 0,

    init: function(opts) {
      var newOpts = {};

      //强制关闭autocomplete选项
      this._dom.attr("autocomplete", "off");
      this.suggestList = $('<ul id="search-suggest-' + genDomId() + '" class="suggest"></ul>');

      //合并配置项                    
      for (var i in opts) {
        var el = opts[i] ,
          field = camelize(i);
        newOpts[field] = el;
      }
      ;

      $.extend(true, this, newOpts);

      !this.renderDataFun && (this.renderDataFun = this._defaultRenderDataFun);
      !this.fillDataFun && (this.fillDataFun = this._defaultFillDataFun);
      if (this.customClass) {
        this.suggestList.addClass(this.customClass);
      }
      //把列表项容器挂载到dom           
      $("body").append(this.suggestList);

      //挂载事件
      this._bindEvent();
    },

    hideList: function() {
      this.suggestList.hide();
      this._fixPos(false);

      this.curIndex = 0;
      this._stop();
    },

    getDom: function() {
      return this._dom;
    },

    getSuggestData: function(word) {
      if (word == undefined) {
        word = this._dom.val();
      }
      return ("undefined" != typeof (this.history[word])) ? this.history[word] : {};
    },

    genDomId: function() {
      return genDomId();
    },

    _start: function() {
      var self = this;

      clearInterval(this._suggestTimer);

      this._suggestTimer = setInterval(function() {
        var word = $(self._dom).val(),
        	oldWord = self.inputWord;
        if (self.trimKW) {
          word = $.trim(word);
        }
        if (self.inputWord != word) {
          /* 自定义事件：beforesuggest */
          if ($(self).triggerHandler('suggest.beforesuggest') === false) {
            return false;
          }
          /* 自定义事件：beforesuggest */
          self.inputWord = word;
          self._doGetData(word);
          /* 自定义事件：afterinputchange */
          if ($(self).triggerHandler('suggest.afterinputchange', oldWord, word) === false) {
            return false;
          }
          /* 自定义事件：afterinputchange */
        }
      }, self.lazySuggestTime);
    },

    _stop: function() {
      clearInterval(this._suggestTimer);
    },

    _isValidWord: function(word) {
      if (word.length > 50) {
        return false;
      }

      if (this.invalidWords[word]) {
        return false;
      }

      return true;
    },

    _parseData: function(word, jsonData) {
      var parsedData = {} , dataStr,
        self = this;
      try {
        parsedData = $.parseJSON(jsonData);
      } catch (exp) {}

      dataStr = stringify(parsedData);

      this._initList(parsedData)

      if (dataStr === "{}" || dataStr === "[]") {
        if (!self.emptyPrompt) {
          this.invalidWords[word] = 1;
          this.hideList();
        }
      } else {
        this.history[word] = jsonData;
      }

      this._parsing = 0;

	    /* 自定义事件：aftersuggest */
	    if ($(this).triggerHandler('suggest.aftersuggest') === false) {
	        return false;
	    }
    	/* 自定义事件：aftersuggest */
    },

    _initList: function(data) {
      var list = [] ,
        nowWord = this._dom.val();
      if (this.trimKW) {
        nowWord = $.trim(nowWord);
      }

      this._fixPos(true);

      list.push(this.renderDataFun(nowWord, data));

      this.suggestList.html(list.join("")).show();

      this._dealwithListDirection();
    },

    _defaultFillDataFun: function(item) {
      this._dom.val(stripTags($(item).html()));
    },

    _defaultRenderDataFun: function(nowWord, data) {
      var list = [] , tmp ,
        len = data.length;

      list.push('<li class="fold-bg"></li>');

      for (var i = 0; i < len; ++i) {
        tmp = data[i].replace(nowWord, "<em class='red'>" + nowWord + "</em>");
        list.push('<li class="fold-item"><span class="title">' + tmp + '</span></li>');
      }

      return list.join("");
    },

    _doGetData: function(word) {

      var self = this , clearLongRequest;

      if ("" == word.trim()) {
        this.hideList();
        return false;
      }

      if (this.prefixProtected && !self._isValidWord(word)) {
        this.hideList();
        return false;
      }
      if (word.length < self.minWordLength) {
        this.hideList();
        return false;
      }

      clearLongRequest = function() {
        var oldTime = this._parsing;
        if (!oldTime) {
          return;
        }

        var now = +new Date();
        if (now - oldTime > 2000) {
          this._parsing = 0;
        }
      };

      if (self._parsing) {
        clearLongRequest.apply(this);
      }

      if (!self._parsing) {
        self._parsing = +new Date();

        setTimeout(function() {
          clearLongRequest.apply(self);
        }, 2000);
        if (self.history[word]) {
          self._parseData(word, self.history[word]);
        } else {
          if (this.dataUrl || (!this.dataUrl) && this.getDataFun == "data_provider_byword") {
            var url = self.dataUrl.replace(/%KEYWORD%/, encodeURIComponent(word)) ,
              afterData = function(d) {
                var nd,
                  data = {
                    rawdata: d
                  };

                /* 自定义事件：aftergetdata */
                nd = $(this).triggerHandler('suggest.aftergetdata', data);
              	/* 自定义事件：aftergetdata */

                if (nd === false) {
                  return false;
                }

                return data.rawdata;
              };

            if (this.getDataFun == "ajax") {
              $.get(url, {}, function(d) {
                d = afterData.call(self, d) ;
                if (d === false) {
                  return false;
                }
                self._parseData(word, d);
              });
            } else if (this.getDataFun == "jsonp") {
              	$.ajax({
              		url : url, 
              		data : {}, 
              		success : function(d, textStatus) {
		                d = afterData.call(self, d) ;
		                if (d === false) {
		                  return false;
		                }
                		self._parseData(word, stringify(d));
              		}, 
              		dataType : 'jsonp',
              		jsonp : self.ajax_jsonp || 'callback'
              	});
            } else if (this.getDataFun == "data_provider_byword") {
              this.dataProvider.call(self, word, function(d) {
                d = afterData.call(self, d) ;
                if (d === false) {
                  return false;
                }
                self._parseData(word, stringify(d));
              });
            } else if (this.getDataFun == "remotejs") {
              var paramInfo = self.remoteCall.split(".") ,
                lp = paramInfo.length ,
                tmp = {} ,
                _t = "";

              if (lp < 1) {
                return;
              }

              tmp[paramInfo[lp - 1]] = function(d) {
                d = afterData.call(self, d) ;
                if (d === false) {
                  return false;
                }

                self._parseData(word, stringify(d));
              };

              for (var i = lp - 2; i >= 0; --i) {
                tmp[paramInfo[i]] = tmp[paramInfo[i]] || {} ;
                tmp[paramInfo[i]][paramInfo[i + 1]] = tmp[paramInfo[i + 1]];
              }

              if (lp == 1) {
                window[paramInfo[0]] = window[paramInfo[0]] || tmp[paramInfo[0]] || {};
              } else {
                window[paramInfo[0]] = window[paramInfo[0]] || {};
                window[paramInfo[0]][paramInfo[1]] = tmp[paramInfo[1]];
              }

              if (self.remoteCallExpire) {
                _t = Math.floor(+(new Date()) / 1000 / self.remoteCallExpire);
                if (/\?/.test(url)) {
                  _t = "&_t=" + _t;
                } else {
                  _t = "?_t=" + _t;
                }
              }

              $.ajax({
                url: url + _t,
                dataType: 'script',
                type: 'GET',
                scriptCharset: self.remoteCallCharset,
                success: function() {}
              });
            } else if (this.getDataFun == "remoteparam") {
              $.ajax({
                url: url,
                dataType: 'script',
                type: 'GET',
                scriptCharset: self.remoteCallCharset,
                success: function() {
                  var d = window[self.remoteCall];
                  d = afterData.call(self, d) ;
                  if (d === false) {
                    return false;
                  }
                  self._parseData(word, stringify(d));
                }
              });
            }
          } else {
            self._parseData(word, self.suggestData);
          }
        }
      }
    },

    _submitMe: function(obj) {
      var self = this , fireResult , frmNode;

      $(obj).removeClass(self.itemHoverStyle);

      if (!$(obj).hasClass(self.itemFakeClass)) {
        self.hideList();
      }
      self.fillDataFun(obj);
      if (self.autoSubmit) {
        frmNode = self._dom.closest("form");

        fireResult = frmNode.triggerHandler("submit");
        if (!(fireResult === false)) {
          frmNode.submit();
        }
      }

      if ($.trim(self._dom.val()) != "") {
        self.inputWord = $(self._dom).val();
      }
    },

    _bindEvent: function() {
      var self = this ;

      this._dom.on("blur", function() {
        self._stop();
      });

      this._dom.on("keyup", function(e) {
        var keyCode = e.which;
        if (keyCode != 38 && keyCode != 40 && keyCode != 13) {
          self.curIndex = 0;
        }
      });

      this._dom.on("paste", function(e) {
        self._start();
      });

      this._dom.on("keydown", function(e) {
        var keyCode = e.which;

        if (keyCode > 111 && keyCode < 138) { // F1 ~F12 以及控制键无事件
          return;
        }
        if (noEventKeycode.indexOf(keyCode) != -1) { //指定的不响应控制键无事件
          return;
        }
        if (keyCode == 27) { //ESC键,隐藏列表
          self.hideList();
          return;
        }
        if (keyCode == 13) {
          if (self.curIndex != 0) {

            self.hideList();
            if (!self.autoSubmit) {
              e.preventDefault();
            }
          }
          return;
        }
        if (keyCode == 38 || keyCode == 40) { //上下光标键
          	self._stop();

          	var liLen = self.suggestList.find(self.itemSelectors).length;
	        if (liLen) {
	            ++liLen;
	            if (keyCode == 38) {
	              self.curIndex = (self.curIndex - 1 + liLen) % liLen;
	              /* NOTICE !!!!
	              	 为了业务需要，有些项需要跳过选择
	              */
	              var _curNode = self.suggestList.find(self.itemSelectors)[self.curIndex - 1];
	              if (_curNode && $(_curNode).hasClass(self.itemFakeClass)) {
	                self.curIndex = (self.curIndex - 1 + liLen) % liLen;
	              }
	            } else if (keyCode == 40) {
	              self.curIndex = (self.curIndex + 1 + liLen) % liLen;
	              /* NOTICE !!!!
	              	 为了业务需要，有些项需要跳过选择
	              */
	              var _curNode = self.suggestList.find(self.itemSelectors)[self.curIndex - 1];
	              if (_curNode && $(_curNode).hasClass(self.itemFakeClass)) {
	                self.curIndex = (self.curIndex + 1 + liLen) % liLen;
	              }
	            }

	            if (self.curIndex == 0) {
	              self._dom.val(self.inputWord);
	              self.suggestList.find(self.itemSelectors).removeClass(self.itemHoverStyle);
	            } else {
		              var selectedDom = self.suggestList.find(self.itemSelectors)[self.curIndex - 1];
		              /* 自定义事件：beforechoose */
		              if ($(self).triggerHandler('suggest.beforechoose', selectedDom) === false) {
		                return false;
		              }
		              /* 自定义事件：beforechoose */


		              self.suggestList.show();
		              self._dealwithListDirection();
		              self.fillDataFun(selectedDom);
		              self.suggestList.find(self.itemSelectors).removeClass(self.itemHoverStyle);
		              $(selectedDom).addClass(self.itemHoverStyle);

		              /* 自定义事件：afterchoose */
		              if ($(self).triggerHandler('suggest.afterchoose', selectedDom) === false) {
		                return false;
		              }
		              /* 自定义事件：afterchoose */
            	}
          	}
          	e.preventDefault();
          	return;
        }
        self._start();
      });

      //列表项行为
      self.suggestList.delegate("li", "mouseover", function() {
        $(this).addClass(self.itemHoverStyle);
      }).delegate("li", "mouseout", function() {
        $(this).removeClass(self.itemHoverStyle);
      }).delegate("li", "click", function() {
        self._submitMe.apply(self, [this]);
      });

      //收起列表项
      $("body").on("click", function(e) {
      	/* suggest列表项内的点击处理 */
        var fake_item = $(e.target).parents('li.' + self.itemFakeClass);
        if (fake_item.length > 0 && $(e.target).parents('.suggest').attr('id') == self.suggestList.attr('id')) {
          if (!fake_item.hasClass(self.itemNoneClass)) {
            var near_item = fake_item.next('li:not(.fake)');
            self._dom.val(near_item.find('.sug-item').attr('data'));
            near_item.addClass(self.itemHoverStyle);
          }
          return false;
        }
        /* input上的点击处理 */
        if (e.target == self._dom[0]) {
        	if (self.inputWord) {
        		self.suggestList.show();
		    	self._dealwithListDirection();
        	};
        	return false;
        };
        /* 其他点击 */
        self.hideList();
        self.curIndex = 0;
      });

      //窗口resize时，重定位suggest位置
      $(window).on("resize", (function() {
        var timer ;
        return function() {
          //防止resize时多次调用
          clearTimeout(timer);

          timer = setTimeout(function() {
            self.autoFixListPos && self._resetPos();
          }, 100);
        }
      })());

	      /* 自定义事件 */
	      $(this).on('suggest.beforesuggest', function(e) {
	        if (self.onbeforesuggest) {
	          return self.onbeforesuggest(e);
	        }
	      });
	      $(this).on('suggest.aftersuggest', function(e) {
	        if (self.onaftersuggest) {
	          return self.onaftersuggest(e);
	        }
	      });
	      $(this).on('suggest.afterinputchange', function(e, oldWord, newWord) {
	        if (self.onafterinputchange) {
	          return self.onafterinputchange(e, oldWord, newWord);
	        }
	      });
	      $(this).on('suggest.aftergetdata', function(e, data) {
	        if (self.onaftergetdata) {
	          return self.onaftergetdata(e, data);
	        }
	      });
	      $(this).on('suggest.beforechoose', function(e, selectedDom) {
	        e.selectedDom = selectedDom;
	        if (self.onbeforechoose) {
	          return self.onbeforechoose(e);
	        }
	      });
	      $(this).on('suggest.afterchoose', function(e, selectedDom) {
	        e.selectedDom = selectedDom;
	        if (self.onafterchoose) {
	          return self.onafterchoose(e);
	        }
	      });
    	/* 自定义事件 */
    },

    _dealwithListDirection: function() {},

    _fixPos: (function() {
      var lastDoms = {} ,
        doFix = function() {
          var domPos = this._dom.offset() ,
            lastDom = lastDoms[this.suggestList.attr("id")];

          if (domPos.left != lastDom.left || domPos.top != lastDom.top || domPos.forid != lastDom.forid) {
            this._resetPos();
            lastDom = domPos;
          }
        };

      return function(bool) {
        bool && this.autoFixListPos && (function() {
          var sid = this.suggestList.attr("id") , lastDom;

          if (!lastDoms[sid]) {
            lastDom = this._dom.offset();
            lastDom.forid = sid;
            lastDoms[sid] = lastDom;
            this._resetPos();
          }

          doFix.apply(this);
        }.call(this, arguments[0]));
      };
    }).apply(this),

    _resetPos: function() {
      var domOffset = this._dom.offset(),
        domHeight = this._dom.height(),
        domWidth = this._dom.width();
      var offset = {
          top: domOffset.top,
          left: domOffset.left,
          right: domOffset.left + domWidth,
          bottom: domOffset.top + domHeight,
          width: domWidth,
          height: domHeight
        },
        adjust = this.posAdjust ;

      this.suggestList.css({
        "position": "absolute",
        "top": ((adjust["top"]) ? adjust["top"] + offset.bottom : offset.bottom) + "px",
        "left": ((adjust["left"]) ? adjust["left"] + offset.left : offset.left) + "px",
        "width": ((adjust["width"]) ? adjust["width"] + offset.width : offset.width) + "px",
        "z-index": (adjust["z-index"]) ? adjust["z-index"] : 99
      }, 1);


      this._dealwithListDirection();
    }
  }

  window.Suggest = Suggest;
}(jQuery, window));