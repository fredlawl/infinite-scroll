<?php
    $posts = $_GET['posts_per_page'];

    $copy = array(
        'Lorem ipsum Officia adipisicing esse id culpa fugiat dolore dolor laboris nulla ut laborum in.',
        'Lorem ipsum Aliquip magna aliqua exercitation tempor aliquip cupidatat et incididunt Duis irure incididunt consequat sed deserunt ullamco et minim commodo aute tempor ullamco adipisicing in ut.',
        'Lorem ipsum Magna sint ut adipisicing eu amet.',
        'Lorem ipsum Excepteur sunt nostrud dolor pariatur pariatur veniam magna enim proident quis dolor ut proident sed dolore ex sit deserunt eu sunt et proident anim magna anim culpa commodo magna.',
        'Lorem ipsum Do dolor proident dolor sed magna aute id veniam in qui culpa.',
        'Lorem ipsum Ad sint nostrud ad Excepteur officia.',
        'Lorem ipsum Dolore esse anim commodo sit tempor laborum ex id elit elit quis Ut Excepteur officia est sed exercitation magna minim elit qui eiusmod id aliquip culpa elit incididunt Duis velit et mollit minim Duis sint dolor sunt dolor tempor elit voluptate aliquip fugiat sit in dolore cillum Ut veniam ex nostrud sed ullamco dolor in officia ex id in aliqua dolor sunt laborum nostrud dolore dolore minim anim commodo do est aliqua minim nulla cillum ad eu amet Duis culpa dolor consectetur ut qui est cupidatat ad ut incididunt eu incididunt commodo in sit eiusmod dolore officia nostrud eiusmod aute cupidatat Excepteur aliqua aliquip incididunt cillum ex officia in laborum magna aliquip cupidatat reprehenderit laborum fugiat aliqua Excepteur velit et adipisicing sed laborum cillum voluptate amet ex in in mollit commodo est in nostrud reprehenderit do sunt sint exercitation magna cupidatat ad deserunt est dolore Excepteur aute proident magna eiusmod.'
    );

    ob_start();

?>

<?php for ($i = 0; $i < $posts; $i++) : ?>
    <?php $rand = rand(0, sizeof($copy) - 1); ?>
    <div class="isotope-item">
        <div class="thumbnail">
            <?php if ($rand % 2 == 0) : ?>
                <img src="http://placehold.it/300x200" alt="...">
            <?php endif; ?>
            <div class="caption">
                <h3>Thumbnail label</h3>
                <p><?php echo $copy[$rand]; ?></p>
                <p>
                    <a href="#" class="btn btn-primary" role="button">Button</a>
                    <a href="#" class="btn btn-default" role="button">Button</a>
                </p>
            </div>
        </div>
    </div>
<?php endfor; ?>

<?php ob_end_flush(); ?>