(function(){
	window.PointerEvent = undefined;
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	var zmitiUtil = {
		init:function(){

			var items = $('.zmiti-news-item').hide();
			this.items = items;
			var maxLen = items.size(),
				currentSize = 20;

			this.defaultPageSize = currentSize;

			this.currentSize = currentSize;
			this.loadNews(currentSize);
			

			this.setScroll()
		},

		loadNews:function(currentSize){
			this.items.each(function(i,n){
				if(i<currentSize){
					$(n).show();
				}
			})
		},

		setScroll:function(){
			var self = this;
			var myscroll = new iScroll("zmiti-wrap",{
				vScrollbar:true,
				preventDefault:false,
				click: true,
				scrollY:true,
				tap:true,
				onScrollMove:function(){
					if(!self.isLoadingEnd){

						if (this.y<(this.maxScrollY)) {
							$('.pull_icon').addClass('flip');
							$('.pull_icon').removeClass('loading');
							$('.more span').text('释放加载...');
						}else{
							$('.pull_icon').removeClass('flip loading');
							$('.more span').text('上拉加载...')
						}
					}
				},
				onScrollEnd:function(){
					if(!self.isLoadingEnd){

						if ($('.pull_icon').hasClass('flip')) {
							$('.pull_icon').addClass('loading');
							$('.more span').text('加载中...');
							pullUpAction();
						}
					}
					
				},
				onRefresh:function(){
					$('.more').removeClass('flip');
					$('.more span').text('上拉加载...');
				}
				
			});
		
		function pullUpAction(){

			setTimeout(function(){
				self.currentSize += self.defaultPageSize;
				if(self.currentSize>self.items.size()){
					self.currentSize = self.items.size();
					self.isLoadingEnd = true;
					self.loadNews(self.currentSize);
					myscroll.refresh();
					$('.more span').text('已全部加载完成')
					return;

				}
				self.loadNews(self.currentSize);
				myscroll.refresh();
			}, 1000)
		}
		if ($('.scroller').height()<$('#wrapper').height()) {
			$('.more').hide();
			myscroll.destroy();
		}


		} 
	}

	zmitiUtil.init();

})()