jQuery(document).ready(function($){
	var tabs = $('.cd-tabs');
	
	tabs.each(function(){
		var tab = $(this),
			tabItems = tab.find('ul.cd-tabs-navigation'),
			tabContentWrapper = tab.children('ul.cd-tabs-content'),
			tabNavigation = tab.find('nav');

		tabItems.on('click', 'a', function(event){
			event.preventDefault();
			var selectedItem = $(this);
			if( !selectedItem.hasClass('selected') ) {
				var selectedTab = selectedItem.data('content'),
					selectedContent = tabContentWrapper.find('li[data-content="'+selectedTab+'"]'),
					slectedContentHeight = selectedContent.innerHeight();
				
				tabItems.find('a.selected').removeClass('selected');
				selectedItem.addClass('selected');
				selectedContent.addClass('selected').siblings('li').removeClass('selected');
				//animate tabContentWrapper height when content changes 
				tabContentWrapper.animate({
					'height': slectedContentHeight
				}, 200);
			}
		});

		//hide the .cd-tabs::after element when tabbed navigation has scrolled to the end (mobile version)
		checkScrolling(tabNavigation);
		tabNavigation.on('scroll', function(){ 
			checkScrolling($(this));
		});
	});
	
	$(window).on('resize', function(){
		tabs.each(function(){
			var tab = $(this);
			checkScrolling(tab.find('nav'));
			tab.find('.cd-tabs-content').css('height', 'auto');
		});
	});

	function checkScrolling(tabs){
		var totalTabWidth = parseInt(tabs.children('.cd-tabs-navigation').width()),
		 	tabsViewport = parseInt(tabs.width());
		if( tabs.scrollLeft() >= totalTabWidth - tabsViewport) {
			tabs.parent('.cd-tabs').addClass('is-ended');
		} else {
			tabs.parent('.cd-tabs').removeClass('is-ended');
		}
	}
	
	
	//fix footer position
	$(document).ready(function() { 
		var docHeight = $(window).height();
		var footerHeight = $('.footer').height();
		var footerTop = $('.footer').position().top + footerHeight;  
		/*console.log(docHeight)
		console.log(footerHeight)
		console.log($('.footer').position().top)
		console.log(footerTop)*/
		
		if (footerTop < docHeight) {
			$('.footer').css('margin-top', (docHeight - footerTop) - 38 + 'px');
			/*$('.footer').css('position', 'fixed');
			$('.footer').css('bottom', '0');*/
		}
		
	});

	//Booking form - special cargo toggle
	$(function() {
		$('#special_cargo').change(function(){
    		if (this.checked) {
        		$('#reserve_space').css('display', 'none');
    		}
			else {
				$('#reserve_space').css('display', 'block');
			}
		})
	});
	
	


});



