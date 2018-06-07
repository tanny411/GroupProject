function openSlideMenu(){
  document.getElementById('sidebar').style.width = 'auto';
 //document.getElementById('sidebar').classList.toggle('collapse');
 //also uncommet transform in .sidebar in css, and set width =auto to achieve this effect
}

function closeSlideMenu(){
  document.getElementById('sidebar').style.width = '0';
  //document.getElementById('sidebar').classList.toggle('collapse');
}
function showfiles(){
  document.getElementById('2').classList.toggle('fa-angle-right');
  document.getElementById('2').classList.toggle('fa-angle-down');
  
  document.getElementById('files').classList.toggle('noshow');
}
function showfolders(){
  document.getElementById('1').classList.toggle('fa-angle-right');
  document.getElementById('1').classList.toggle('fa-angle-down');

  document.getElementById('folders').classList.toggle('noshow');

  $('.dropdown-submenu ul').hide();
  $('.dropdown-submenu a').children('i').addClass("fa-folder");
  $('.dropdown-submenu a').children('i').removeClass("fa-folder-open");
}
$(document).ready(function(){
  
  $('.tagbtn').on("click",function(e){
    e.preventDefault();
    document.getElementById('tagtext').style.width='150px';
  });

  $('.tofolderbtn').on("click",function(e){
    e.preventDefault();
    document.getElementById('tofoldertext').style.width='150px';
  });

  $(document).on("click",".dropdown-submenu a.clk",function(e){
    $(this).next().next('ul').toggle();
    $(this).children('i').toggleClass("fa-folder");
    $(this).children('i').toggleClass("fa-folder-open");
  });

  $(document).on("click",".addfolder",function(e){
    $(this).next('ul').show();
    $(this).prev('a').children('i').addClass("fa-folder-open");
    $(this).prev('a').children('i').removeClass("fa-folder");

    var li=document.createElement('li');
    li.className='dropdown-submenu';
    var a=document.createElement('a');
    a.className='clk';
    var a_i=document.createElement('i');
    a_i.className='fa fa-folder';
    var a_text=document.createElement('input');
    a_text.setAttribute("type", "text");
    a_text.className="newfoldertext";

    var i=document.createElement('i');
    i.className='fa fa-minus r8 remove';

    a.appendChild(a_i);
    a.appendChild(a_text);

    li.appendChild(a);
    li.appendChild(i);

    var ul=document.createElement('ul');
    li.appendChild(ul);

    $(this).next('ul').append(li);
  });

  $(document).on("click",".remove",function(e){
    $(this).parent('li').remove();
  });

  $(document).on("keypress",".newfoldertext",function(e){
    if(e.which == 13) {
        var x=$(this).val();
        if(x.length>0){
          x=' '+x;
          $(this).parent().append(document.createTextNode(x));
          $(this).parent().next('i').removeClass('fa-minus remove');
          $(this).parent().next('i').addClass('fa-plus addfolder');

          var y=$(this).parent('a').parent('li').parent('ul').parent('li').children('a').text();
          
          $(this).remove();
          
          addfolderphp(x,y);
        }
    }
  });

  $('#searchfiles').on("keyup",function(e){
    var x=$('#searchfiles').val();
    if(x.length>0)
    {
      $('.searchresults').removeClass('hide');
      setTimeout(function () {
        $('.searchresults').removeClass('visuallyhidden');
      }, 20);

      search(x,'#'+Math.random()+'#');
    }
    else {
      $('.searchresults').addClass('visuallyhidden');
      $('.searchresults').one('transitionend', function(e) {
        $('.searchresults').addClass('hide');
      });
    }
  });

  $('.drop').on("click",function(e){
    $(this).parent().next('ul').toggle();
    $(this).toggleClass('fa-angle-right');
    $(this).toggleClass('fa-angle-down');
  });
});

function search(x,y){
  //y is separator
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'searchfiles.php', true);
  xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      x=xhr.responseText;
      arr=x.split(y);
      document.getElementById('searchtag').innerHTML=arr[0];
      document.getElementById('searchfile').innerHTML=arr[1];
      document.getElementById('searchtype').innerHTML=arr[2];
      document.getElementById('searchpost').innerHTML=arr[3];
    }
  };
  xhr.send("x="+x+"&groupid="+document.getElementById('group_id').value+"&rand="+y);
}

function addfolderphp(folder,parent)
{
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'addfolder.php', true);
  xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
  xhr.send("folder="+folder+"&parent="+parent+"&groupid="+document.getElementById('group_id').value);
}

window.onload = function () {

  var form = document.getElementById('post');

  form.onsubmit = function (event) {
    
    event.preventDefault();

    if(document.getElementById('posttext').value=="" && document.getElementById('filebtn').value=="") return;

    var formData = new FormData(form);
    formData.append('task', 'addpost');
    formData.append('userid', document.getElementById('user_id').value);
    formData.append('groupid', document.getElementById('group_id').value);
    formData.append('username', document.getElementById('user_name').value);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'addpost.php', true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        $('.feed').prepend(xhr.responseText);
        document.getElementById('posttext').value="";
        document.getElementById('tagtext').value="";
        document.getElementById('tofoldertext').value="";
        document.getElementById('filebtn').value="";
      }
    };

    xhr.send(formData);
  }
};
