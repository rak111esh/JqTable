<?php
$nfilas = 10;
$nmeses = 12;
$ncolumnas = $nmeses ;
$time = new DateTime("01/01/2010");
?>
<table>
<thead>
<tr>
<th></th>
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
	<?php
		for ($j=0; $j<$ncolumnas+1; $j++){
	?>
		<?php if ($j==0){ ?>
			<td>Cost Center <?php echo chr(65+$i)?></td>
		<?php } else { ?>	
			<td><?php echo rand(8000,50000)?>.<?php echo rand(0,99)?></td>
		<?php } ?>
	<?php
	}
	?>
	</tr>
	<?php
		for ($k=0; $k<rand(1,6); $k++){
		?>
			<tr>
			<?php
				for ($l=0; $l<$ncolumnas+1; $l++){
			?>
				<?php if ($l==0){ ?>
					<td>Cost Center <?php echo chr(65+$i)?>.<?php echo $k?></td>
				<?php } else { ?>	
					<td><?php echo rand(300,900)?>.<?php echo rand(0,99)?></td>
				<?php } ?>				
			<?php
				}
			?>
			</tr>
		<?php
		}
	}
	?>
	</tbody>
</table>
