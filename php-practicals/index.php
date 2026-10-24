<?php
session_start();
$envPath = __DIR__ . '/.env';
if (file_exists($envPath)) {
  foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) continue;
    [$key, $value] = explode('=', $line, 2);
    $_ENV[trim($key)] = trim($value);
  }
}
function h($value) { return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8'); }
function db() {
  $host=$_ENV['DB_HOST']??'localhost'; $port=$_ENV['DB_PORT']??'3306';
  $name=$_ENV['DB_NAME']??'dancesphere_db'; $user=$_ENV['DB_USER']??'root'; $pass=$_ENV['DB_PASSWORD']??'';
  return new PDO("mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4",$user,$pass,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
}
$message=''; $error='';
if ($_SERVER['REQUEST_METHOD']==='POST') {
  $action=$_POST['action']??'save';
  if ($action==='login') {
    $name=trim($_POST['name']??'');
    if (mb_strlen($name)<2) $error='Please enter at least two characters.';
    else { $_SESSION['demo_name']=$name; $message='Demo session started. Hello, '.h($name).'!'; }
  } elseif ($action==='logout') {
    session_unset(); session_destroy(); session_start(); $message='You have logged out of the PHP demo session.';
  } elseif ($action==='save') {
    $name=trim($_POST['name']??''); $email=filter_var(trim($_POST['email']??''),FILTER_VALIDATE_EMAIL); $note=trim($_POST['message']??'');
    if (mb_strlen($name)<2) $error='Name must contain at least two characters.';
    elseif (!$email) $error='Enter a valid email address.';
    elseif (mb_strlen($note)<5) $error='Message must contain at least five characters.';
    else {
      $message='Form validated. String helper example: '.h(strtoupper($name));
      try {
        $pdo=db();
        $classId=(int)($_POST['class_id']??0);
        if ($classId>0) {
          $stmt=$pdo->prepare('INSERT INTO enquiries(class_id,name,email,message) VALUES(?,?,?,?)');
          $stmt->execute([$classId,$name,$email,$note]);
          $message='Enquiry saved to MySQL. Name uppercase example: '.h(strtoupper($name));
        } else $message='Form validated successfully. Add a valid class ID to save the enquiry in MySQL.';
      } catch (Throwable $e) { $error='MySQL is not connected or the class ID is invalid. Check .env and database setup. Validation still ran safely.'; }
    }
  } elseif ($action==='delete') {
    try { $pdo=db(); $stmt=$pdo->prepare('DELETE FROM enquiries WHERE id=?'); $stmt->execute([(int)($_POST['id']??0)]); $message='Enquiry deleted if that ID existed.'; }
    catch(Throwable $e) { $error='Could not delete. Check database configuration.'; }
  }
}
$enquiries=[];
try { $pdo=db(); $enquiries=$pdo->query('SELECT id,class_id,name,email,message,status,created_at FROM enquiries ORDER BY created_at DESC LIMIT 30')->fetchAll(); }
catch(Throwable $e) { /* PHP validation/session demo remains available without MySQL. */ }
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DanceSphere PHP Practical</title>
<style>
:root{font-family:Arial,sans-serif;color:#302b25;background:#f5f0e7;--paper:#fffdf8;--terra:#b95f45;--line:#ded7ca}*{box-sizing:border-box}body{margin:0}.wrap{max-width:980px;margin:auto;padding:28px 18px}header{background:#e8e0d3;border-bottom:1px solid var(--line)}h1,h2{font-family:Georgia,serif;font-weight:500}h1{font-size:clamp(32px,5vw,48px);margin:8px 0}p{line-height:1.6}.eyebrow{font-size:10px;letter-spacing:2px;color:#737b58;font-weight:bold}.card{padding:24px;background:var(--paper);border:1px solid var(--line);margin:20px 0}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}label{display:block;font-size:12px;margin-bottom:15px}input,textarea{display:block;width:100%;padding:12px;border:1px solid #d8d0c4;background:white;margin-top:7px;font:inherit}button{border:0;background:var(--terra);color:white;padding:12px 16px;cursor:pointer}button.secondary{background:#e8e0d3;color:#302b25}.message{padding:12px;background:#e4e7d9;color:#566342}.error{padding:12px;background:#f2dfd7;color:#963f30}.muted{color:#777267;font-size:12px}table{width:100%;border-collapse:collapse;font-size:12px}td,th{text-align:left;padding:10px;border-bottom:1px solid var(--line)}.session{display:flex;justify-content:space-between;align-items:center;gap:15px;flex-wrap:wrap}@media(max-width:650px){.grid{grid-template-columns:1fr}.card{padding:17px}}
</style></head><body><header><div class="wrap"><div class="eyebrow">DANCESPHERE · WEB TECHNOLOGIES LAB</div><h1>PHP practical module</h1><p>Form handling, validation, sessions, string manipulation and PDO/MySQL CRUD.</p></div></header><main class="wrap">
<?php if($message): ?><div class="message"><?= $message ?></div><?php endif; ?><?php if($error): ?><div class="error"><?= h($error) ?></div><?php endif; ?>
<section class="card session"><div><strong>PHP session status</strong><p class="muted"><?= isset($_SESSION['demo_name'])?'Signed in as '.h($_SESSION['demo_name']):'No demo session is active.' ?></p></div><form method="post"><input type="hidden" name="action" value="logout"><button class="secondary">End session</button></form></section>
<div class="grid"><section class="card"><h2>Start a demo session</h2><form method="post"><input type="hidden" name="action" value="login"><label>Your name<input name="name" required minlength="2" value="<?= h($_SESSION['demo_name']??'') ?>"></label><button>Start session</button></form><p class="muted">Demonstrates session_start(), session variables and session_destroy().</p></section>
<section class="card"><h2>Submit an enquiry</h2><form method="post"><input type="hidden" name="action" value="save"><label>Name<input name="name" required minlength="2"></label><label>Email<input type="email" name="email" required></label><label>Class ID (optional for validation demo)<input type="number" min="1" name="class_id"></label><label>Message<textarea name="message" required minlength="5" rows="3"></textarea></label><button>Validate and save</button></form><p class="muted">Uses trim(), mb_strlen(), filter_var(), strtoupper(), PDO and prepared statements.</p></section></div>
<section class="card"><h2>Enquiry records — MySQL CRUD: Read / Delete</h2><p class="muted">Create works when a valid class ID is provided. This page lists stored records and allows deletion.</p><?php if(!$enquiries): ?><p>No records available, or MySQL is not configured. Form validation still works.</p><?php else: ?><div style="overflow-x:auto"><table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr></thead><tbody><?php foreach($enquiries as $item): ?><tr><td><?= h($item['id']) ?></td><td><?= h($item['name']) ?></td><td><?= h($item['email']) ?></td><td><?= h($item['status']) ?></td><td><form method="post" onsubmit="return confirm('Delete this enquiry?')"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= h($item['id']) ?>"><button class="secondary">Delete</button></form></td></tr><?php endforeach; ?></tbody></table></div><?php endif; ?></section>
<p class="muted">Academic demonstration only. Do not use this module as production authentication or expose it publicly without additional security controls.</p></main></body></html>
