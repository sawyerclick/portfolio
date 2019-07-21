$(".btn").click(function(e){
  e.preventDefault();
  var category = $(this).data("category")
  $('.column').hide();
  $('.column.'+category).fadeIn();
})