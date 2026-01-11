import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "PetPhoto 是如何工作的？",
    answer: "您只需上传清晰的宠物照片，选择想要的风格（如证件照、职业角色、文化风格等），我们的 AI 系统会在几分钟内自动生成高质量的创意照片。整个过程简单快捷，无需任何专业技能。",
  },
  {
    question: "生成的照片质量如何？",
    answer: "我们使用最先进的 AI 图像生成技术，确保每张照片都具有专业级别的画质。标准版提供高清输出，专业版更可达到超高清级别，足以用于打印和商业用途。",
  },
  {
    question: "支持哪些宠物类型？",
    answer: "PetPhoto 支持所有常见宠物类型，包括狗、猫、兔子、仓鼠等。我们的 AI 模型经过大量训练，能够准确识别和处理各种品种和体型的宠物。",
  },
  {
    question: "照片生成需要多长时间？",
    answer: "处理时间取决于您选择的套餐。体验版通常在 3 天内交付，标准版 1 天交付，专业版可当天完成。实际处理过程只需几分钟，额外时间主要用于质量检查和优化。",
  },
  {
    question: "如果对结果不满意怎么办？",
    answer: "我们提供重制服务。标准版用户可免费重制 1 次，专业版用户可重制 3 次。此外，所有套餐都享有 7 天无理由退款保障，确保您的满意度。",
  },
  {
    question: "照片会被用作其他用途吗？",
    answer: "绝对不会。我们严格保护用户隐私，所有上传的照片和生成的作品仅供您个人使用。我们不会在未经许可的情况下使用、分享或出售您的照片。",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            常见问题
          </h2>
          <p className="text-xl text-muted-foreground">
            关于 PetPhoto 您可能想了解的一切
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border last:border-0"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            还有其他问题？
          </p>
          <Button variant="outline" size="lg" className="rounded-full">
            联系客服
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
