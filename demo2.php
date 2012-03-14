<link rel="stylesheet" type="text/css" href="css/style.css">
<link rel="stylesheet" type="text/css" href="css/reset.css">
<script src="js/jquery-1.7.1.js"></script>
<script src="js/jqtable.js"></script>
<script languaje="javascript">
	$(document).ready(function(){
		var tableSettings = {
			scrollInterval:  [1,'last'],/*last-N, first+1*/
			intervalLength: 3,
			scrollPosition: 1, 
			height: 500,
		}
		
		$("table").jqtable(tableSettings);

	});
</script>
<?php
$nfilas = 30;
$nmeses = 12;
$ncolumnas = $nmeses ;
$time = new DateTime("01/01/2010");
?>
<table>
<thead>
	<tr class="column-title">
	<th class="empty"></th>
	<?php
		for ($i=0; $i<$nmeses; $i++){
	?>
			<th><?php echo $time->format('M Y'); ?></th>
	<?php
			$time->add(new DateInterval("P1M"));
		}
	?>
	</tr>		
</thead>
	<tbody>		
	<?php
	for ($i=0; $i<$nfilas; $i++){
	?>
	<tr>
	<?php for ($j=0; $j<$ncolumnas+1; $j++){ ?>
		<?php if ($j==0){ ?>
			<th class="row-title">Cost Center <?php echo chr(65+$i)?></th>
		<?php } else { ?>	
			<td>
			<?php 
				$number=floatval(rand(1000,50000).".".rand(0,99));
				echo number_format($number, 2)." U$";
			?>
			</td>
		<?php } ?>
	<?php } ?>
	<?php
	}
	?>
	</tbody>
</table>