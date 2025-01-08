from django.shortcuts import render
from .models import Block, Transaction,Blockchain
from django.shortcuts import redirect
from django.utils.timezone import now
from datetime import datetime
import time
from django.shortcuts import get_object_or_404
import hashlib

blockchain = Blockchain() 

# Create your views here.

def home(request):
    blocks = Block.objects.all()
    context = {"blocks": blocks}
    return render(request, "home.html", context)


def add_transaction(request):
    if request.method == "POST":
        student_id = request.POST.get("student_id")
        course = request.POST.get("course")
        score = request.POST.get("score")

        # Thêm giao dịch mới
        transaction = blockchain.add_transaction(student_id, course, score)
        print(f"New Transaction Added: {transaction}")  # Log giao dịch mới

        return render(request, "add_transaction.html", {"success": True})

    return render(request, "add_transaction.html")


def edit_block(request, index):
    # Lấy Block theo index
    block = get_object_or_404(Block, index=index)
    print(f"Editing Block: Index {block.index}, Previous Hash {block.previous_hash}, Hash {block.hash}")  # Log thông tin khối

    if request.method == "POST":
        # Cập nhật thông tin của Block
        block.previous_hash = request.POST.get("previous_hash")
        block.nonce = int(request.POST.get("nonce"))
        block.save()
        print(f"Block Updated: Index {block.index}, Previous Hash {block.previous_hash}, Nonce {block.nonce}")  # Log sau cập nhật

        # Cập nhật giao dịch liên quan
        transaction_ids = request.POST.getlist("transaction_id")
        student_ids = request.POST.getlist("student_id")
        courses = request.POST.getlist("course")
        scores = request.POST.getlist("score")

        for tx_id, student_id, course, score in zip(transaction_ids, student_ids, courses, scores):
            transaction = Transaction.objects.get(transaction_id=tx_id)
            original_hash = transaction.hash  # Lưu lại hash ban đầu để phát hiện thay đổi
            transaction.student_id = student_id
            transaction.course = course
            transaction.score = float(score)

            # Tính lại hash của giao dịch sau khi thay đổi
            transaction.hash = transaction.calculateHash()  # Tính lại hash cho giao dịch
            transaction.save()
            print(f"Transaction Updated: ID {tx_id}, Student ID {student_id}, Course {course}, Score {score}")  # Log giao dịch cập nhật

        # Tính lại hash và Merkle Root của block sau khi sửa đổi giao dịch
        block.hash = block.calculateHash()
        block.merkle_root = block.calculateMerkleRoot()  # Cập nhật Merkle Root
        block.save()

        return redirect('home')

    # Lấy tất cả giao dịch liên quan đến Block
    transactions = block.transactions.all()
    print(f"Transactions Linked to Block {block.index}: {list(transactions)}")  # Log giao dịch liên kết với khối

    return render(request, "edit_block.html", {"block": block, "transactions": transactions})






def mine_block(request):
    # Lấy các giao dịch chờ xử lý
    pending_transactions = Transaction.objects.filter(status="pending")
    print(f"Pending Transactions Before Mining: {list(pending_transactions)}")

    if not pending_transactions.exists():
        print("No pending transactions to mine.")
        return render(request, "mine_block.html", {"error": "Không có giao dịch nào để khai thác khối."})

    latest_block = blockchain.get_latest_block()
    index = latest_block.index + 1 if latest_block else 0
    previous_hash = latest_block.hash if latest_block else "0"

    # Tạo khối mới
    new_block = Block(index=index, previous_hash=previous_hash)
    new_block.save()
    print(f"New Block Created: Index {new_block.index}, Previous Hash {new_block.previous_hash}")

    # Gắn giao dịch vào Block
    new_block.transactions.set(pending_transactions)
    new_block.merkle_root = new_block.calculateMerkleRoot()
    new_block.hash = new_block.calculateHash()  # Tính lại hash của block sau khi thêm giao dịch
    new_block.save()

    # Cập nhật trạng thái giao dịch
    pending_transactions.update(status="mined")
    print(f"Transactions Linked to Block {new_block.index}: {list(new_block.transactions.all())}")

    return render(request, "mine_block.html", {"block": new_block})




def validate_chain(request):
    blocks = Block.objects.all().order_by('index')
    validation_results = []
    is_valid = True

    for i in range(len(blocks)):
        current_block = blocks[i]
        previous_block = blocks[i - 1] if i > 0 else None

        # Tính lại hash và Merkle Root
        recalculated_hash = current_block.calculateHash()
        recalculated_merkle_root = current_block.calculateMerkleRoot()

        # Kiểm tra khối hiện tại
        block_valid = True
        errors = []

        if current_block.hash != recalculated_hash:
            block_valid = False
            errors.append("Hash không khớp.")
        if previous_block and current_block.previous_hash != previous_block.hash:
            block_valid = False
            errors.append("Previous hash không khớp.")
        # if current_block.merkle_root != recalculated_merkle_root:
        #     block_valid = False
        #     errors.append("Merkle root không khớp.")

        if not block_valid:
            is_valid = False

        validation_results.append({
            "block": current_block,
            "valid": block_valid,
            "errors": errors,
            "recalculated_hash": recalculated_hash,
            "recalculated_merkle_root": recalculated_merkle_root,
        })

    context = {
        "is_valid": is_valid,
        "validation_results": validation_results,
    }
    return render(request, "validate_chain.html", context)




def reset_blockchain(request):
    # Xóa tất cả các block
    Block.objects.all().delete()

    # Xóa tất cả các giao dịch
    Transaction.objects.all().delete()

    # Tạo Genesis Block
    genesis_timestamp = time.mktime(datetime(2025, 1, 1, 0, 0, 0).timetuple())
    genesis_block = Block(index=0, previous_hash="0", merkle_root="0",timestamp=genesis_timestamp)
    genesis_block.hash = genesis_block.calculateHash()
    genesis_block.save()

    return redirect('home')  # Chuyển hướng về trang chủ