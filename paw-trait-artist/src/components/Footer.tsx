const Footer = () => {
  return (
    <footer className="bg-muted/20 border-t border-border py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              PetPhoto
            </h3>
            <p className="text-sm text-muted-foreground">
              AI 驱动的宠物创意照片生成平台
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">产品</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">功能介绍</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">价格方案</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">案例展示</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">支持</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">帮助中心</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">常见问题</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">联系我们</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">法律</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">隐私政策</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">服务条款</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">退款政策</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PetPhoto. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
