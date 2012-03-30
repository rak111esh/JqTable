<style>
	table {
		border-collapse: collapse;
		border-spacing:0;
		position: relative;

	}

	table td, table th{
		border: 1px solid red;
		background-color: yellow;
	}
</style>
<?php
	$nrow = 20;
	$ncolums = 7;
?>
<table>
	<thead>
		<tr>
		<?php for ($j=0; $j<$ncolums ; $j++) {?>
			<th><?php echo "Title ".($j+1)?></th>
		<?php }?>
		</tr>
	</thead>
<tbody>
<?php for ($i=0; $i<$nrow ; $i++) {?>
	<tr>
		<?php for ($j=0; $j<$ncolums ; $j++) {?>
			<td><?php echo rand(1560,3200)?></td>
		<?php }?>
	</tr>
<?php }?>
</tbody>
</table>