<?php
	include('core.inc.php');
	include('connect.inc.php');
	
	$user=getUser();
	if(isset($_SESSION['group_id']) && !empty($_SESSION['group_id'])) $group_id=$_SESSION['group_id'];
	else header('location: /groupstudy/groupproject/main_page.php');

	//GROUP-NAME
	$query="select name from groups where id='".$group_id."'";
	if($query_run=mysqli_query($con,$query)){
		mysqli_data_seek($query_run,0);
		$row=mysqli_fetch_row($query_run);
		$group_name=$row[0];
	}
	else die('Server Error');

	//assoc of all-users id and name
	$allusers[$user[0]]=$user[1];
	//USER-LIST-CHAT
	$userList="";
	$query="select user_id from user_group where group_id='".$group_id."'";
	if($query_run=mysqli_query($con,$query)){
		while($query_row=mysqli_fetch_assoc($query_run)){
			$id=$query_row['user_id'];
			if($id==$user[0]) continue;
			$query="select Username from user where ID='".$id."'";
			if($query_run2=mysqli_query($con,$query)){
				mysqli_data_seek($query_run2,0);
				$row=mysqli_fetch_row($query_run2);
				$name=$row[0];
				$userList=$userList."<li>".$name."</li>";
				//assoc save
				$allusers[$id]=$name;
			}
			else die('Server Error');
		}
	}
	else die('Server Error');


	//FEED and FILE
	$feed="";
	$fileList="";
	//file-folder & folder-folder assoc
	$filein=array();
	$folderin=array();

	$query="select * from files where group_id='".$group_id."' order by timestamp desc";
	if($query_run=mysqli_query($con,$query)){
		while($query_row=mysqli_fetch_assoc($query_run)){
			
			$feed.=" <div class=\"apost\">
			<h3 class=\"author\">".$allusers[$query_row['user_id']]."</h3>
			<div class=\"time\">".$query_row['timestamp']."</div>
			<div class=\"aposttext\">".$query_row['post']."</div>
			<div class=\"file-folder\">".$query_row['file_name']." in ".$query_row['folder']."</div>
			</div>";

			if($query_row['file_name']!="") {
				$fileList.="<li><i class=\"fa fa-file-o\"></i> ".$query_row['file_name']."</li>";
				$filein[ $query_row['folder'] ][]=$query_row['file_name'];
			}
		}
	}
	else die('Server Error');


	///FOLDER
	$query="select folder,parent from folder where group_id='".$group_id."'";
	if($query_run=mysqli_query($con,$query)){
		while($query_row=mysqli_fetch_assoc($query_run)){
			$folderin[ $query_row['parent'] ][]=$query_row['folder'];
		}
	}

	$str="<li class=\"dropdown-submenu\"><a class=\"clk\"><i class=\"fa fa-folder\"></i> root</a><i class=\"fa fa-plus addfolder r8\"></i>";
	//$str="";
	function dfs($folder)
	{
		global $str;
		global $filein;
		global $folderin;
				
		$str.="<ul>";

		if (array_key_exists($folder, $filein)) {
			foreach($filein[$folder] as $file){
				$str.="<li><i class=\"fa fa-file-o\"></i> ".$file."</li>";
			}
		}
		if (array_key_exists($folder, $folderin))  {
			foreach($folderin[$folder] as $fol){
				$str.="<li class=\"dropdown-submenu\"><a class=\"clk\"><i class=\"fa fa-folder\"></i> ".$fol."</a><i class=\"fa fa-plus addfolder r8\"></i>";
				dfs($fol);
				$str.="</li>";
			}
		}

		$str.="</ul>";
	}

	dfs("root");
	$str.="</li>";

	include('grouppage.html');
?>