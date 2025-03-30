import React from 'react';

function Home() {
  return (
    <div>
      <div>
        <h2>Chuỗi cung ứng thuốc - Hệ thống Blockchain</h2>
        <img
          src={require('./images/supplychain.jpg')}
          alt="Sơ đồ chuỗi cung ứng thuốc"
          style={{ maxWidth: '100%', margin: '1rem 0', width: "800px", height: "300px" }}
        />
      </div>

      <div>
        <h3>1. Nhà cung cấp nguyên liệu</h3>
        <p>
          Nguyên liệu thô như hoạt chất, tá dược,... được cung cấp bởi các công ty dược uy tín, đảm bảo tiêu chuẩn GSP và kiểm định đầu vào.
        </p>
        <img
          src={require('./images/supplier.jpg')}
          alt="Nhà cung cấp"
          style={{ maxWidth: '100%', margin: '1rem 0', width: "800px", height: "300px" }}
        />
      </div>

      <div>
        <h3>2. Cơ quan quản lý dược</h3>
        <p>
          Trước khi sản xuất, các lô nguyên liệu phải được Cục Quản lý Dược phê duyệt để đảm bảo đạt tiêu chuẩn chất lượng, an toàn và hợp pháp.
        </p>
        <img
          src={require('./images/approval.jpg')}
          alt="Cơ quan dược"
          style={{ maxWidth: '100%', margin: '1rem 0', width: "800px", height: "300px" }}
        />
      </div>

      <div>
        <h3>3. Nhà sản xuất</h3>
        <p>
          Các nhà máy sản xuất thuốc đạt chuẩn GMP-WHO tiến hành bào chế, đóng gói và gắn mã truy vết cho từng hộp thuốc dựa trên các lô nguyên liệu được duyệt.
        </p>
        <img
          src={require('./images/manufacturer.jpg')}
          alt="Nhà sản xuất"
          style={{ maxWidth: '100%', margin: '1rem 0', width: "800px", height: "300px" }}
        />
      </div>
      <div>
        <h3>6. Nhà thuốc</h3>
        <p>
          Thuốc được phân phối đến các nhà thuốc đạt chuẩn GPP. Tại đây, trạng thái hộp thuốc sẽ được cập nhật và sẵn sàng phân phối cho người tiêu dùng cuối.
        </p>
        <img
          src={require('./images/pharmacy.jpg')}
          alt="Nhà thuốc"
          style={{ maxWidth: '100%', margin: '1rem 0', width: "800px", height: "300px" }}
        />
      </div>

      <div>
        <h3>7. Người tiêu dùng</h3>
        <p>
          Người dùng cuối có thể kiểm tra toàn bộ hành trình sản xuất - vận chuyển - phân phối thuốc thông qua mã QR hoặc truy xuất blockchain.
        </p>
        <img
          src={require('./images/customer.jpg')}
          alt="Người tiêu dùng"
          style={{ maxWidth: '100%', margin: '1rem 0', width: "800px", height: "300px" }}
        />
      </div>
    </div>
  );
}

export default Home;
