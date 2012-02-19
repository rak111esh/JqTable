<link rel="stylesheet" type="text/css" href="css/style.css">
<script src="js/jquery-1.7.1.js"></script>
<script src="js/jqtable.js"></script>
<script languaje="javascript">
	$(document).ready(function(){
		var tableSettings = {
			scrollInterval:  [0,'last'],/*last-N, first+1*/
			intervalLength: 3,
		}
	
		$("table").jqtable(tableSettings);
	});
</script>
<?php
$nfilas = 20;
$nmeses = 12;
$ncolumnas = $nmeses ;
$time = new DateTime("01/01/2010");
?>
<table>
<thead>
</thead>
	<tbody>
	<tr>
	<td></td>
	<?php
		for ($i=0; $i<$nmeses; $i++){
	?>
			<td><?php echo $time->format('M Y'); ?></td>
	<?php
			$time->add(new DateInterval("P1M"));
		}
	?>
	</tr>		
	<?php
	for ($i=0; $i<$nfilas; $i++){
	?>
	<tr>
	<?php
		for ($j=0; $j<$ncolumnas+1; $j++){
	?>
		<?php if ($j==0){ ?>
			<td>Cost Center <?php echo chr(65+$i)?></td>
		<?php } else { ?>	
			<td>
			<?php 
				$number=floatval(rand(1000,50000).".".rand(0,99));
				echo number_format($number, 2);
			?>
			</td>
		<?php } ?>
	<?php
	}
	?>
	</tr>
	<?php
	}
	?>
	</tbody>
</table>
<a href="#">first</a>
<a href="#">previus</a>
<a href="#">next</a>
<a href="#">last</a>