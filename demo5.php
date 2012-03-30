<link rel="stylesheet" type="text/css" href="css/style.css">
<link rel="stylesheet" type="text/css" href="css/reset.css">
<script src="js/jquery-1.7.1.js"></script>
<script src="js/jqtable.js"></script>
<script languaje="javascript">
	$(document).ready(function(){
		var tableSettings = {
			height: 500,
			scrollInterval:  [1,'last'],/*last-N, first+1*/
			scrollWindowSize: 3,
			step: 3,
			secondLevelActive: true,
			secondLevel:{
				rowClass:'jqSecondLevel',
			}
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
	<tr class="column-title">
	<th class="empty"></th>
	<?php for ($i=0; $i<$nmeses; $i++){ ?>
		<?php for ($x=0; $x<3 ; $x++) { ?>
			<th><?php echo $time->format('M Y'); ?></th>
		<?php } ?>
		<?php $time->add(new DateInterval("P1M")); } ?>
	</tr>
	<tr class="column-title">
	<th class="empty"></th>
		<?php  $counter=0; for ($p=0 ; $p<($nmeses*3); $p++) { ?>
			<th> 
				<?php if ($counter==0) echo "Max Cost"; ?>
				<?php if ($counter==1) echo "Medium Cost"; ?>
				<?php if ($counter==2) echo "Average Cost"; ?>
				<?php
					$counter ++;
					if ($counter == 3)
						$counter = 0;
				?>
			</th>
		<?php }?>
	</tr>			
</thead>
	<tbody>		
		<?php for ($i=0; $i<$nfilas; $i++){ ?>
			<tr>
				<?php for ($j=0; $j<($ncolumnas*3)+1; $j++){ ?>
					<?php if ($j==0) {?>
						<th>Cost Center <?php echo chr(65+$i)?></th>
					<?php } else {?>
						<td>
							<?php 
								$number=floatval(rand(1000,50000).".".rand(0,99));
								echo number_format($number, 2)." U$";
							?>
						</td>
					<?php } ?>
				<?php } ?>
			</tr>
			<?php for ($k=0 ; $k<rand(3,4); $k++){ ?>
				<tr class="jqSecondLevel">
					<?php for ($w=0 ; $w<($ncolumnas*3)+1 ; $w++){ ?>
						<?php if ($w==0){ ?>
							<th class="row-title"><div>SubCost Center <?php echo chr(65+$i).".".($k+1)?></div></th>
						<?php } else { ?>
							<td>
							<?php 
								$number=floatval(rand(300,850).".".rand(0,99));
								echo number_format($number, 2)." U$";
							?>
							</td>
						<?php } ?>
					<?php } ?>
				</tr>
			<?php } ?>
		<?php } ?>
	</tbody>
</table>