(function(){
    var selectedElements = [];
    var all = Array.prototype.slice.call(document.querySelectorAll("body *"));
    document.body.oncontextmenu = function(){return false;}
    all.forEach(function(o, i){
      o.onmouseover = function(e){
        e.stopPropagation();
        o.setAttribute('highlight', "true");
      }
      o.onmouseout = function(){
        o.removeAttribute('highlight');
      }
      o.onmousedown = function(e){
        e.stopPropagation();
        var elements, text = [];
        if(e.button == 0){ // 选择相似元素
            if(this.getAttribute('highlight-add')){ // 已被标亮则删除
                // this.classList.remove('highlight_add');
                this.removeAttribute('highlight');
                elements = _xpath.getSimilarElements(o);
                elements.forEach(function(element){
                    element.removeAttribute('highlight-add');
                });
                selectedElements.forEach(function(e, i){
                    if(e.xpath === _xpath.similarPath){
                        selectedElements.splice(i, 1);
                    }
                })
            }else{ // 未标亮则添加
                // this.classList.add('highlight_add');
                elements = _xpath.getSimilarElements(o);
                // 只保留单个结果时，将原有的样式取消
                if(selectedElements.length > 0){
                    selectedElements.forEach(function(o, i){
                        o.elements.forEach(function(e){
                            e.removeAttribute('highlight-add');
                            e.removeAttribute('highlight-add-single');
                        });
                    });
                }
                elements.forEach(function(element){
                    element.setAttribute('highlight-add', "true");
                    text.push(element.innerText);
                });
                selectedElements[0] = {xpath: _xpath.similarPath, elements: elements, text: text};
                // selectedElements.push({xpath: _xpath.similarPath, elements: elements, text: text});
            }
        }else if(e.button == 2){ // 选择单个元素
            if(this.getAttribute('highlight-add-single')){ // 已被标亮则删除
                // this.classList.remove('highlight_add');
                this.removeAttribute('highlight');
                this.removeAttribute('highlight-add-single');
                selectedElements.forEach(function(e, i){
                    if(e.xpath === _xpath.getPath(this)){
                        selectedElements.splice(i, 1);
                    }
                })
            }else{ // 未标亮则添加
                // this.classList.add('highlight_add');
                // 只保留单个结果时，将原有的样式取消
                if(selectedElements.length > 0){
                    selectedElements.forEach(function(o, i){
                        o.elements.forEach(function(e){
                            e.removeAttribute('highlight-add-single');
                            e.removeAttribute('highlight-add');
                        });
                    });
                }
                this.setAttribute('highlight-add-single', "true");
                text.push(this.innerText);
                selectedElements[0] = {xpath: _xpath.getPath(this), elements: [this], text: text};
                // selectedElements.push({xpath: _xpath.getPath(this), elements: elements, text: text});
            }
        }
        var selectedElementsText = selectedElements.map(function(o){
            return {xpath: o.xpath, text: o.text};
        })
        // window.postMessage(selectedElementsText, '*');
        window.top.setSelectedElements(selectedElementsText);
      }
    });

    // window.addEventListener('message', function(e){
    //     console.log(e);
    // }, false);
})();