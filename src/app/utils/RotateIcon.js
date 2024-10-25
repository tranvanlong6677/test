import { tr } from "date-fns/locale";

const RotateIcon = function (options) {
    this.options = options || {};
    this.rImg = options.img || new Image();
    this.rImg.src = this.rImg.src || this.options.url || '';
    this.options.width = this.options.width || this.rImg.width || 52;
    this.options.height = this.options.height || this.rImg.height || 60;
    const canvas = document.createElement("canvas");
    canvas.width = this.options.width;
    canvas.height = this.options.height;
    this.context = canvas.getContext("2d");
    this.canvas = canvas;
};


RotateIcon.makeIcon = function (url) {
    return new RotateIcon({ url: url });
};
RotateIcon.prototype.loadImage = function (options) {
    return new Promise((resolve, reject) => {
        if (this.rImg.complete) {
            // Nếu ảnh đã tải xong
            resolve(this.rImg);
        } else {
            // Đợi ảnh tải xong
            this.rImg.onload = () => resolve(this.rImg);
            this.rImg.onerror = reject;
        }
    });
}
RotateIcon.prototype.setRotation = async function (options) {
    await this.loadImage();
    const canvas = this.context,
        angle = options.deg ? options.deg * Math.PI / 180 :
            options.rad,
        centerX = this.options.width / 2,
        centerY = this.options.height / 2;
    canvas.clearRect(0, 0, this.options.width, this.options.height);
    canvas.save();
    canvas.translate(centerX, centerY);
    canvas.rotate(angle);
    canvas.translate(-centerX, -centerY);
    // Tạo ảnh lần đầu (khi chưa xoay)
    canvas.drawImage(this.rImg, 0, 0);
    canvas.restore();

    return this;
};

RotateIcon.prototype.getUrl = function () {
    return this.canvas.toDataURL('image/png');
};

export default RotateIcon;